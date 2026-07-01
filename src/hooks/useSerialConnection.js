import { useState, useEffect } from "react";
import { serialInstance } from "../utils/serialService";

/**
 * useSerialConnection
 * Manages USB Serial port connection, auto-connect on mount,
 * and the connect/disconnect toggle handler.
 *
 * @param {Object} params
 * @param {Function} params.setToast - Toast notification setter from Dashboard
 */
export function useSerialConnection({ setToast }) {
  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState("Disconnected");

  // Auto-connect to a previously approved port on mount, and listen for device events
  useEffect(() => {
    const tryAutoConnect = async () => {
      const connected = await serialInstance.autoConnectValidPort();
      if (connected) {
        setIsConnected(true);
        setStatusText("Connected to Device (Auto)");
      }
    };

    serialInstance.onConnectStatusChange = (status) => {
      setIsConnected(status);
      setStatusText(
        status ? "Connected to Device (Auto)" : "Device Disconnected",
      );
    };

    tryAutoConnect();

    return () => {
      serialInstance.onConnectStatusChange = null;
    };
  }, []);

  /** Toggle between connect and disconnect */
  const handleConnect = async () => {
    if (!isConnected) {
      const portSelected = await serialInstance.requestPort();
      if (portSelected) {
        const connected = await serialInstance.connect(115200);
        if (connected) {
          setIsConnected(true);
          setStatusText("Connected to Device");
        } else {
          setStatusText("Failed to Connect");
        }
      }
    } else {
      await serialInstance.disconnect();
      setIsConnected(false);
      setStatusText("Disconnected");
    }
  };

  return {
    isConnected,
    setIsConnected,
    statusText,
    setStatusText,
    handleConnect,
  };
}
