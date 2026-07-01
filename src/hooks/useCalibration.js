import { useState, useRef, useEffect } from "react";
import { serialInstance } from "../utils/serialService";
import { baselineCorrection, findPeak } from "../utils/mathUtils";

/**
 * useCalibration
 * Manages calibration sweep via Serial, baseline data, calibration peak,
 * and import of baseline CSV files.
 * Exposes calibrationPeakRef and calibrationCoeffsRef (Refs) for the
 * measurement loop to read without triggering re-renders.
 *
 * @param {Object} params
 * @param {boolean} params.isConnected - Serial connection state from useSerialConnection
 * @param {Function} params.setToast   - Toast notification setter from Dashboard
 */
export function useCalibration({ isConnected, setToast }) {
  // Chart & sweep data
  const [chartData, setChartData] = useState([]);
  const [freqData, setFreqData] = useState([]);

  // Operation states
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Calibration results
  const [calibrationBaseLine, setCalibrationBaseLine] = useState([]);
  const [baselineFreqs, setBaselineFreqs] = useState([]);
  const [baselineMag, setBaselineMag] = useState([]);
  const [calibrationCoeffs, setCalibrationCoeffs] = useState([]);
  const [calibrationPeak, setCalibrationPeak] = useState(null);

  // UI / page flow
  const [checkPage, setCheckPage] = useState("blank"); // 'blank' | 'measure'
  const [openBcEntry, setOpenBcEntry] = useState("");
  const [saveBcEntry, setSaveBcEntry] = useState("");
  const [directoryBcEntry, setDirectoryBcEntry] = useState(
    "C:/Users/Victus 15/QCM_Data/Baseline",
  );

  // ── Refs exposed for useMeasurementLoop (read without re-render cost) ──
  const calibrationPeakRef = useRef(calibrationPeak);
  const calibrationCoeffsRef = useRef(calibrationCoeffs);

  useEffect(() => {
    calibrationPeakRef.current = calibrationPeak;
  }, [calibrationPeak]);

  useEffect(() => {
    calibrationCoeffsRef.current = calibrationCoeffs;
  }, [calibrationCoeffs]);

  // ── Handlers ────────────────────────────────────────────────────────────

  /** Run a full 8–12 MHz calibration sweep over Serial */
  const handleCalibrate = async () => {
    if (!isConnected) return;
    setIsCalibrating(true);
    setChartData([]);
    setCheckPage("blank");
    setCalibrationPeak(null);

    const resetSuccess = await serialInstance.resetConnection();
    if (!resetSuccess) {
      setToast({
        message: "Failed to reset serial connection.",
        type: "error",
      });
      setIsCalibrating(false);
      return;
    }

    const startFreq = 8000000;
    const stopFreq = 12000000;
    const fStep = 1000;
    await serialInstance.writeCommand(`${startFreq};${stopFreq};${fStep}\n`);

    const buffer = await serialInstance.readData(100);
    const dataRaw = buffer.split(/\r?\n/);
    const dataMag = [];

    const vmax = 4.096;
    const bitmax = 65536;
    const ADCtoVolt = vmax / bitmax;
    const VCP = 0.9;

    for (let i = 0; i < dataRaw.length; i++) {
      const line = dataRaw[i].trim();
      if (!line || line === "s" || line === "Connected") continue;
      const parsedVal = parseFloat(line);
      if (isNaN(parsedVal)) continue;
      dataMag.push((parsedVal * ADCtoVolt - VCP) / 0.03);
    }

    const readFREQ = [];
    const samples = dataMag.length;

    try {
      if (samples < 9) {
        throw new Error(
          `Incomplete calibration data: received ${samples} points (expected ~4000). Please check the serial connection.`,
        );
      }

      for (let i = 0; i < samples; i++) {
        readFREQ.push(8 + (12 - 8) * (i / (samples - 1)));
      }

      const { magBaselineCorrected, coeffs } = baselineCorrection(
        readFREQ,
        dataMag,
        8,
      );
      setCalibrationBaseLine(magBaselineCorrected);
      setCalibrationCoeffs(coeffs);
      setBaselineFreqs(readFREQ);
      setBaselineMag(dataMag);

      const plotData = readFREQ.map((f, i) => [f, dataMag[i]]);
      setChartData(plotData);

      const readFREQHz = readFREQ.map((f) => f * 1e6);
      const peakInfo = findPeak(readFREQHz, magBaselineCorrected, 4000);
      const peakFreqVal = peakInfo.maxFreqs[0];
      const peakAmpVal = peakInfo.maxValues[0];
      setCalibrationPeak({ freq: peakFreqVal, value: peakAmpVal });

      // Validate peak: amplitude > 0.1 dB and frequency between 9.0–11.0 MHz
      if (peakAmpVal > 0.1 && peakFreqVal > 9.0e6 && peakFreqVal < 11.0e6) {
        setCheckPage("measure");
        setToast({
          message: `Calibration Success! Peak found at ${(peakFreqVal / 1e6).toFixed(4)} MHz (${peakAmpVal.toFixed(2)} dB)`,
          type: "success",
        });
      } else {
        setCheckPage("blank");
        setToast({
          message: `Calibration failed. Peak at ${(peakFreqVal / 1e6).toFixed(4)} MHz (${peakAmpVal.toFixed(2)} dB) is out of bounds.`,
          type: "error",
        });
      }
    } catch (e) {
      console.error("Calibration error:", e);
      setCheckPage("blank");
      if (
        e.message?.includes("lost") ||
        e.message?.includes("closed") ||
        e.message?.includes("device")
      ) {
        setToast({ message: "Connection to QCM device lost.", type: "error" });
      } else {
        setToast({
          message: e.message || "Calibration math error.",
          type: "error",
        });
      }
    }

    setIsCalibrating(false);
  };

  /** Import a previously saved baseline CSV file */
  const handleImportBaselineCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        if (lines.length < 2) {
          throw new Error(
            "Invalid CSV format: file is empty or missing headers.",
          );
        }

        const xf = [];
        const rawData = [];
        const baseLine = [];
        const coeffs = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length >= 3) {
            xf.push(parseFloat(row[0]));
            rawData.push(parseFloat(row[1]));
            baseLine.push(parseFloat(row[2]));
            if (row[3] !== undefined && row[3] !== "" && coeffs.length < 9) {
              coeffs.push(parseFloat(row[3]));
            }
          }
        }

        if (baseLine.length === 0)
          throw new Error("No data points found in CSV.");

        setCheckPage("measure");
        setOpenBcEntry(file.name);

        const freqsMHz = xf.map((f) => f / 1e6);
        const plotData = freqsMHz.map((f, i) => [f, rawData[i]]);

        setChartData(plotData);
        setCalibrationBaseLine(baseLine);
        setCalibrationCoeffs(coeffs);
        setBaselineFreqs(freqsMHz);
        setBaselineMag(rawData);

        const peakInfo = findPeak(xf, baseLine, 4000);
        setCalibrationPeak({
          freq: peakInfo.maxFreqs[0],
          value: peakInfo.maxValues[0],
        });

        setToast({
          message: `Successfully loaded baseline CSV: "${file.name}"`,
          type: "success",
        });
      } catch (err) {
        console.error("Baseline CSV import error:", err);
        setToast({
          message: `Failed to load CSV: ${err.message}`,
          type: "error",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return {
    // State
    chartData,
    setChartData,
    freqData,
    setFreqData,
    isCalibrating,
    isMeasuring,
    calibrationBaseLine,
    setCalibrationBaseLine,
    baselineFreqs,
    setBaselineFreqs,
    baselineMag,
    setBaselineMag,
    calibrationCoeffs,
    setCalibrationCoeffs,
    calibrationPeak,
    setCalibrationPeak,
    checkPage,
    setCheckPage,
    openBcEntry,
    setOpenBcEntry,
    saveBcEntry,
    setSaveBcEntry,
    directoryBcEntry,
    setDirectoryBcEntry,
    // Refs (for measurement loop)
    calibrationPeakRef,
    calibrationCoeffsRef,
    // Handlers
    handleCalibrate,
    handleImportBaselineCSV,
  };
}
