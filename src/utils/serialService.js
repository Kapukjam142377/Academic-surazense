export class SerialService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.keepReading = true;
    this.onConnectStatusChange = null;
    this.isConnecting = false;
    this._setupAutoConnectListeners();
  }

  _setupAutoConnectListeners() {
    if (navigator.serial) {
      navigator.serial.addEventListener("connect", async (event) => {
        // Automatically connect to the port that was just plugged in
        const port = event.target;
        this.port = port;
        try {
          await this.connect(115200);
          if (this.onConnectStatusChange) this.onConnectStatusChange(true);
        } catch (e) {
          console.error("Auto-connect failed:", e);
        }
      });

      navigator.serial.addEventListener("disconnect", (event) => {
        if (this.port === event.target) {
          this.disconnect();
          if (this.onConnectStatusChange) this.onConnectStatusChange(false);
        }
      });
    }
  }

  // Check if there are previously approved ports, and auto connect
  async autoConnectValidPort() {
    if (!navigator.serial) return false;
    try {
      const ports = await navigator.serial.getPorts();
      if (ports.length > 0) {
        this.port = ports[0];
        return await this.connect(115200);
      }
    } catch (e) {
      console.error("Failed to fetch pre-authorized ports", e);
    }
    return false;
  }

  async requestPort() {
    try {
      if (!navigator.serial) {
        alert(
          "เบราว์เซอร์ของคุณไม่รองรับ Web Serial API (แนะนำ Chrome / Edge)",
        );
        return false;
      }
      this.port = await navigator.serial.requestPort();
      return true;
    } catch (e) {
      console.error("User cancelled port selection.");
      return false;
    }
  }

  async connect(baudRate = 115200) {
    if (!this.port) return false;

    // Prevent errors if already manually opened or locked
    if (this.port.readable) return true;

    // Check if we are already in the middle of a connection attempt (React StrictMode)
    if (this.isConnecting) {
      // Short delay to wait for the other connection to finish
      await new Promise((r) => setTimeout(r, 500));
      return !!this.port?.readable;
    }

    this.isConnecting = true;
    try {
      await this.port.open({
        baudRate: baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      });
      this.isConnecting = false;
      return true;
    } catch (e) {
      console.error("Connect error:", e);
      this.isConnecting = false;
      return false;
    }
  }

  async disconnect() {
    this.keepReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {}
      this.reader = null;
    }
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {}
      this.port = null;
    }
  }

  async closePortOnly() {
    this.keepReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {}
      this.reader = null;
    }
    if (this.writer) {
      try {
        this.writer.releaseLock();
      } catch (e) {}
      this.writer = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {}
    }
  }

  async openPortOnly(baudRate = 115200) {
    if (!this.port) return false;
    try {
      await this.port.open({
        baudRate: baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      });
      this.keepReading = true;
      return true;
    } catch (e) {
      console.error("Open port error:", e);
      return false;
    }
  }

  async resetConnection() {
    if (!this.port) return false;
    console.log("Resetting serial connection to clear buffers...");
    await this.closePortOnly();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const opened = await this.openPortOnly(115200);
    if (opened) {
      console.log(
        "Serial connection reset successful. Waiting for device boot...",
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return true;
    }
    return false;
  }

  async writeCommand(cmd) {
    if (!this.port) return;
    console.log("Writing serial command:", JSON.stringify(cmd));
    const encoder = new TextEncoder();
    this.writer = this.port.writable.getWriter();
    await this.writer.write(encoder.encode(cmd));
    this.writer.releaseLock();
  }

  async cancelRead() {
    this.keepReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {}
      this.reader = null;
    }
  }

  async readData(expectedLines = 0) {
    console.log(`readData started (expectedLines: ${expectedLines})`);
    let buffer = "";
    const decoder = new TextDecoder();

    if (!this.port || !this.port.readable) {
      console.warn("readData: port is not readable or closed.");
      return buffer;
    }

    this.keepReading = true;

    try {
      this.reader = this.port.readable.getReader();
    } catch (e) {
      console.error(
        "readData: Failed to get reader (port might be locked):",
        e,
      );
      return buffer;
    }

    try {
      while (this.keepReading) {
        const { value, done } = await this.reader.read();
        if (done) {
          console.log("readData: done signaled by stream");
          break;
        }

        if (value) {
          const decoded = decoder.decode(value, { stream: true });
          buffer += decoded;
          console.log(
            `readData: received chunk (${value.length} bytes). Total buffer length: ${buffer.length}. Ends with 's': ${buffer.endsWith("s")}`,
          );

          // Check for 's' and discard old incomplete sweep data if any
          let hasS = buffer.includes("s");
          while (hasS) {
            const sIndex = buffer.indexOf("s");
            const linesBeforeS = buffer.substring(0, sIndex).split("\n").length;
            console.log(
              `readData: found 's' at index ${sIndex}. Lines before: ${linesBeforeS}`,
            );

            if (expectedLines > 0 && linesBeforeS < expectedLines) {
              console.log(
                `readData: lines before 's' (${linesBeforeS}) < expectedLines (${expectedLines}). Discarding leftover buffer up to 's'.`,
              );
              buffer = buffer.substring(sIndex + 1);
              hasS = buffer.includes("s");
            } else {
              console.log(
                `readData: lines before 's' (${linesBeforeS}) >= expectedLines (${expectedLines}). Keeping buffer.`,
              );
              break;
            }
          }

          if (buffer.includes("s")) {
            console.log("readData: valid 's' found. Breaking read loop.");
            break;
          }
        }
      }
    } catch (error) {
      console.error("readData: Read error:", error);
    } finally {
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch (e) {}
        this.reader = null;
      }
      console.log(
        `readData finished. Returned buffer length: ${buffer.length}`,
      );
    }
    return buffer;
  }
}

export const serialInstance = new SerialService();
