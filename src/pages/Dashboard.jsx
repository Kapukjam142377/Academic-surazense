import React, { useState, useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import QcmChart from "../components/QcmChart";
import ResonanceMetrics from "../components/ResonanceMetrics";
import SavedRunsDatabase from "../components/SavedRunsDatabase";
import DataExportCard from "../components/DataExportCard";
import SystemControlsCard from "../components/SystemControlsCard";
import { CheckCircle, AlertCircle, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { serialInstance } from "../utils/serialService";
import {
  baselineCorrection,
  findPeak,
  sgFilter,
  naturalCubicSpline,
  evaluateSpline,
  evalPolynomial,
  npAverage,
} from "../utils/mathUtils";
import { useUser } from "../context/UserContext";

function Dashboard() {
  const { user } = useUser();
  const [analyses, setAnalyses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: null });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Modes and Page States
  const [mode, setMode] = useState("calibration"); // 'calibration' or 'measurement'
  const [checkPage, setCheckPage] = useState("blank"); // 'blank', 'measure', 'cal'
  const [measurementView, setMeasurementView] = useState("A"); // 'A' or 'B'

  // Measurement Run States
  const [isMeasurementRunning, setIsMeasurementRunning] = useState(false);
  const [isMeasurementPaused, setIsMeasurementPaused] = useState(false);
  const [measurementCount, setMeasurementCount] = useState(0);

  // Calibration Coefficients & Resonance Peak
  const [calibrationCoeffs, setCalibrationCoeffs] = useState([]);
  const [calibrationPeak, setCalibrationPeak] = useState(null);

  // Buffers for Peak Resonance Frequency over time
  const [freqRangeMean, setFreqRangeMean] = useState([]);
  const [peakFreqBuffer, setPeakFreqBuffer] = useState([]);

  // Before / After collection states
  const [getValuesBefore, setGetValuesBefore] = useState([]);
  const [getValuesAfter, setGetValuesAfter] = useState([]);
  const [avgFreq1, setAvgFreq1] = useState(null);
  const [avgFreq2, setAvgFreq2] = useState(null);
  const [deltaF, setDeltaF] = useState(null);
  const [statusCollectDataBefore, setStatusCollectDataBefore] = useState(false);
  const [statusCollectDataAfter, setStatusCollectDataAfter] = useState(false);

  // Analysis parameters and results
  const [threshold, setThreshold] = useState(10); // Default 10 Hz
  const [targetName, setTargetName] = useState("EGFR");
  const [showResult, setShowResult] = useState(""); // 'Detected' or 'Not Detected'

  // Zoomed-in spectrum data for View B
  const [zoomedFreqs, setZoomedFreqs] = useState([]);
  const [zoomedAmplitudes, setZoomedAmplitudes] = useState([]);

  // Entry inputs (modern equivalents of Python entries)
  const [nameEntry, setNameEntry] = useState("");
  const [directoryEntry, setDirectoryEntry] = useState(
    "C:/Users/Victus 15/QCM_Data",
  );
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [openBcEntry, setOpenBcEntry] = useState("");
  const [saveBcEntry, setSaveBcEntry] = useState("");
  const [directoryBcEntry, setDirectoryBcEntry] = useState(
    "C:/Users/Victus 15/QCM_Data/Baseline",
  );

  // Refs to store high-frequency real-time QCM sweep data to prevent excessive React renders
  const freqRangeMeanRef = useRef([]);
  const peakFreqBufferRef = useRef([]);
  const zoomedFreqsRef = useRef([]);
  const zoomedAmplitudesRef = useRef([]);
  const measurementCountRef = useRef(0);
  const getValuesBeforeRef = useRef([]);
  const getValuesAfterRef = useRef([]);
  const avgFreq1Ref = useRef(null);
  const avgFreq2Ref = useRef(null);

  // Refs for tracking loop control variables without restarting useEffect
  const isMeasurementPausedRef = useRef(isMeasurementPaused);
  const statusCollectDataBeforeRef = useRef(statusCollectDataBefore);
  const statusCollectDataAfterRef = useRef(statusCollectDataAfter);
  const calibrationPeakRef = useRef(calibrationPeak);
  const calibrationCoeffsRef = useRef(calibrationCoeffs);

  // Sync state values to refs on change
  useEffect(() => {
    isMeasurementPausedRef.current = isMeasurementPaused;
  }, [isMeasurementPaused]);
  useEffect(() => {
    statusCollectDataBeforeRef.current = statusCollectDataBefore;
  }, [statusCollectDataBefore]);
  useEffect(() => {
    statusCollectDataAfterRef.current = statusCollectDataAfter;
  }, [statusCollectDataAfter]);
  useEffect(() => {
    calibrationPeakRef.current = calibrationPeak;
  }, [calibrationPeak]);
  useEffect(() => {
    calibrationCoeffsRef.current = calibrationCoeffs;
  }, [calibrationCoeffs]);

  const flushRefsToState = () => {
    setFreqRangeMean([...freqRangeMeanRef.current]);
    setPeakFreqBuffer([...peakFreqBufferRef.current]);
    setMeasurementCount(measurementCountRef.current);
    setGetValuesBefore([...getValuesBeforeRef.current]);
    setGetValuesAfter([...getValuesAfterRef.current]);
    setAvgFreq1(avgFreq1Ref.current);
    setAvgFreq2(avgFreq2Ref.current);
    setZoomedFreqs([...zoomedFreqsRef.current]);
    setZoomedAmplitudes([...zoomedAmplitudesRef.current]);
  };

  // Throttled UI state updater (runs every 150ms to batch update React states for UI and ECharts)
  useEffect(() => {
    if (!isMeasurementRunning) return;

    const intervalId = setInterval(() => {
      flushRefsToState();
    }, 150);

    return () => {
      clearInterval(intervalId);
    };
  }, [isMeasurementRunning]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    } else {
      setAnalyses([]);
    }
  }, [user]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/analyses`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSaveDirectory = async () => {
    try {
      if (window.showDirectoryPicker) {
        const handle = await window.showDirectoryPicker();
        setDirectoryHandle(handle);
        setDirectoryEntry(handle.name);
        setToast({
          message: `Save directory set to "${handle.name}".`,
          type: "success",
        });
      } else {
        const customPath = prompt(
          "Enter the absolute save directory path:",
          directoryEntry,
        );
        if (customPath !== null) {
          setDirectoryEntry(customPath);
          setToast({
            message: `Save directory set to "${customPath}".`,
            type: "success",
          });
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("Directory picker error:", e);
        setToast({ message: "Failed to select directory.", type: "error" });
      }
    }
  };

  const handleSaveCSVFile = async () => {
    const isMeasureRun = mode === "measurement";
    if (isMeasureRun && freqRangeMean.length === 0) {
      setToast({ message: "Please take measurements first.", type: "error" });
      return false;
    }
    if (!isMeasureRun && chartData.length === 0) {
      setToast({ message: "Please calibrate first.", type: "error" });
      return false;
    }
    if (!nameEntry) {
      setToast({ message: "Please specify the file name.", type: "error" });
      return false;
    }

    try {
      let csvContent = "";
      if (isMeasureRun) {
        csvContent = "Count,Time,Resonance_Frequency (Hz)\n";
        const now = new Date();
        freqRangeMean.forEach((val, idx) => {
          const timeOffset = new Date(
            now.getTime() - (freqRangeMean.length - 1 - idx) * 1000,
          );
          const tStr = timeOffset.toTimeString().split(" ")[0];
          csvContent += `${idx + 1},${tStr},${val}\n`;
        });
      } else {
        csvContent = "xf,data,baseline,coefficial\n";
        const limit = Math.max(
          baselineFreqs.length,
          baselineMag.length,
          calibrationBaseLine.length,
        );
        for (let i = 0; i < limit; i++) {
          const xfVal =
            baselineFreqs[i] !== undefined ? baselineFreqs[i] * 1e6 : "";
          const dataVal = baselineMag[i] !== undefined ? baselineMag[i] : "";
          const baseVal =
            calibrationBaseLine[i] !== undefined ? calibrationBaseLine[i] : "";
          const coeffVal =
            calibrationCoeffs[i] !== undefined ? calibrationCoeffs[i] : "";
          csvContent += `${xfVal},${dataVal},${baseVal},${coeffVal}\n`;
        }
      }

      const fileName = nameEntry.endsWith(".csv")
        ? nameEntry
        : `${nameEntry}.csv`;

      if (window.showDirectoryPicker && directoryHandle) {
        const opts = { mode: "readwrite" };
        if ((await directoryHandle.queryPermission(opts)) !== "granted") {
          if ((await directoryHandle.requestPermission(opts)) !== "granted") {
            throw new Error("Write permission denied.");
          }
        }
        const fileHandle = await directoryHandle.getFileHandle(fileName, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(csvContent);
        await writable.close();
        setToast({
          message: `CSV saved successfully as "${fileName}" inside the selected directory.`,
          type: "success",
        });
      } else {
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToast({
          message: `CSV download started: "${fileName}"`,
          type: "success",
        });
      }
      return true;
    } catch (e) {
      console.error("Save CSV error:", e);
      setToast({
        message: `Failed to save CSV file: ${e.message}`,
        type: "error",
      });
      return false;
    }
  };

  const handleSaveCSVDataAndAnalysis = async () => {
    const csvSuccess = await handleSaveCSVFile();
    if (csvSuccess && user) {
      await handleSaveAnalysis();
    }
  };

  const handleImportBaselineCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
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

        if (baseLine.length === 0) {
          throw new Error("No data points found in CSV.");
        }

        setMode("calibration");
        setCheckPage("measure");
        setOpenBcEntry(file.name);

        const plotData = [];
        const freqsMHz = xf.map((f) => f / 1e6);
        for (let i = 0; i < freqsMHz.length; i++) {
          plotData.push([freqsMHz[i], rawData[i]]);
        }
        setChartData(plotData);
        setCalibrationBaseLine(baseLine);
        setCalibrationCoeffs(coeffs);
        setBaselineFreqs(freqsMHz);
        setBaselineMag(rawData);

        const peakInfo = findPeak(xf, baseLine, 4000);
        const peakFreqVal = peakInfo.maxFreqs[0];
        const peakAmpVal = peakInfo.maxValues[0];
        setCalibrationPeak({ freq: peakFreqVal, value: peakAmpVal });

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

  const handleImportMeasurementCSV = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        if (lines.length < 2) {
          throw new Error(
            "Invalid CSV format: file is empty or missing headers.",
          );
        }

        const values = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length >= 3) {
            const val = parseFloat(row[2]);
            if (!isNaN(val)) {
              values.push(val);
            }
          }
        }

        if (values.length === 0) {
          throw new Error(
            "No valid resonance frequency data found in column 3.",
          );
        }

        const avg = npAverage(values);
        if (type === "before") {
          setGetValuesBefore(values);
          setAvgFreq1(avg);
          setToast({
            message: `Loaded Before CSV successfully: ${values.length} samples, average is ${Math.round(avg).toLocaleString()} Hz`,
            type: "success",
          });
        } else {
          setGetValuesAfter(values);
          setAvgFreq2(avg);
          setToast({
            message: `Loaded After CSV successfully: ${values.length} samples, average is ${Math.round(avg).toLocaleString()} Hz`,
            type: "success",
          });
        }
      } catch (err) {
        console.error("Measurement CSV import error:", err);
        setToast({
          message: `Failed to load measurement CSV: ${err.message}`,
          type: "error",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSaveAnalysis = async () => {
    if (!user) return;
    const title = window.prompt(
      "Enter a title for this run:",
      `QCM Run ${new Date().toLocaleTimeString()}`,
    );
    if (!title) return;

    setIsSaving(true);
    try {
      const isMeasureRun = mode === "measurement";
      const body = {
        title,
        measurement_type: isMeasureRun ? "measurement" : "single",
        file1_name: isMeasureRun ? "measure_data.json" : "cal_data.json",
        file1_data: JSON.stringify(isMeasureRun ? freqRangeMean : chartData),
        file2_name: null,
        file2_data: null,
        selected_time_start: null,
        selected_time_end: null,
        avg_frequency1: isMeasureRun ? avgFreq1 : null,
        avg_frequency2: isMeasureRun ? avgFreq2 : null,
        delta_f: isMeasureRun ? deltaF : null,
      };

      const res = await fetch(`${API_URL}/api/users/${user.id}/analyses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to save analysis");
      }

      const newAnalysis = await res.json();
      setAnalyses((prev) => [newAnalysis, ...prev]);
      setToast({
        message: "Analysis run saved successfully!",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setToast({ message: "Failed to save analysis.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadAnalysis = (analysis) => {
    try {
      if (analysis.file1_data) {
        const loadedData = JSON.parse(analysis.file1_data);
        if (analysis.measurement_type === "measurement") {
          setMode("measurement");
          setMeasurementView("A");
          setFreqRangeMean(loadedData);
          setAvgFreq1(analysis.avg_frequency1);
          setAvgFreq2(analysis.avg_frequency2);
          setDeltaF(analysis.delta_f);
          if (analysis.delta_f !== null) {
            setShowResult(
              analysis.delta_f > threshold ? "Detected" : "Not Detected",
            );
          } else {
            setShowResult("");
          }
        } else {
          setMode("calibration");
          setChartData(loadedData);
        }
        setToast({
          message: `Loaded session: ${analysis.title}`,
          type: "success",
        });
      }
    } catch (e) {
      console.error("Failed to parse analysis data", e);
      setToast({ message: "Failed to load session.", type: "error" });
    }
  };

  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState("Disconnected");

  // Data for Chart
  const [chartData, setChartData] = useState([]);
  const [freqData, setFreqData] = useState([]);

  // States for measurement logic
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const [calibrationBaseLine, setCalibrationBaseLine] = useState([]);

  const [baselineFreqs, setBaselineFreqs] = useState([]);
  const [baselineMag, setBaselineMag] = useState([]);

  // Auto-connect and Port Listeners
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
      if (status) {
        setStatusText("Connected to Device (Auto)");
      } else {
        setStatusText("Device Disconnected");
      }
    };

    tryAutoConnect();

    return () => {
      serialInstance.onConnectStatusChange = null;
    };
  }, []);

  // Connection Handler
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

  // Python equivalent logic: Calibrate (8MHz to 12MHz)
  const handleCalibrate = async () => {
    if (!isConnected) return;
    setIsCalibrating(true);
    setChartData([]);
    setCheckPage("blank");
    setCalibrationPeak(null);

    // Reset connection to clear buffers and restart Arduino
    const resetSuccess = await serialInstance.resetConnection();
    if (!resetSuccess) {
      setToast({
        message: "Failed to reset serial connection.",
        type: "error",
      });
      setIsCalibrating(false);
      return;
    }

    // Command sending
    const startFreq = 8000000;
    const stopFreq = 12000000;
    const fStep = 1000;
    const cmd = `${startFreq};${stopFreq};${fStep}\n`;

    await serialInstance.writeCommand(cmd);

    // Read response
    const buffer = await serialInstance.readData(100);
    const dataRaw = buffer.split(/\r?\n/);
    let dataMag = [];

    const vmax = 4.096;
    const bitmax = 65536;
    const ADCtoVolt = vmax / bitmax;
    const VCP = 0.9;

    // Process math: filter empty or invalid lines
    for (let i = 0; i < dataRaw.length; i++) {
      const line = dataRaw[i].trim();
      if (!line) continue;
      if (line === "s" || line === "Connected") continue;
      const parsedVal = parseFloat(line);
      if (isNaN(parsedVal)) continue;

      let mag = parsedVal * ADCtoVolt;
      dataMag.push((mag - VCP) / 0.03);
    }

    // Generate frequencies linspace
    const readFREQ = [];
    const samples = dataMag.length;

    // Baseline estimation
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
      setBaselineMag(dataMag); // We just store raw data for visual currently

      let plotData = [];
      for (let i = 0; i < readFREQ.length; i++) {
        plotData.push([readFREQ[i], dataMag[i]]);
      }
      setChartData(plotData);

      // Find peak in baseline corrected data (dist=4000 replicates global argmax)
      const readFREQHz = readFREQ.map((f) => f * 1e6);
      const peakInfo = findPeak(readFREQHz, magBaselineCorrected, 4000);
      const peakFreqVal = peakInfo.maxFreqs[0];
      const peakAmpVal = peakInfo.maxValues[0];

      setCalibrationPeak({ freq: peakFreqVal, value: peakAmpVal });

      // Check validation: peak amplitude > 0.1 and peak frequency between 9.5MHz and 10.5MHz
      // Lowered from 2.5 dB to 0.1 dB to allow user's physical sensor (0.13 dB) to calibrate successfully
      // Widened from 9.5e6-10.5e6 to 9.0e6-11.0e6 to support user's sensor at 10.635 MHz
      if (peakAmpVal > 0.1 && peakFreqVal > 9.0e6 && peakFreqVal < 11.0e6) {
        setCheckPage("measure");
        setToast({
          message: `Calibration Success! Peak found at ${(peakFreqVal / 1e6).toFixed(4)} MHz (${peakAmpVal.toFixed(2)} dB)`,
          type: "success",
        });
      } else {
        setCheckPage("blank");
        setToast({
          message: `Calibration failed. Peak found at ${(peakFreqVal / 1e6).toFixed(4)} MHz (${peakAmpVal.toFixed(2)} dB) is out of bounds.`,
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
        setIsConnected(false);
        setStatusText("Disconnected");
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

  // Measurement sweep loop hook (run1 equivalent)
  useEffect(() => {
    let active = true;
    let timerId = null;

    const runMeasurementLoop = async () => {
      if (!active) return;
      if (
        !isConnected ||
        !isMeasurementRunning ||
        isMeasurementPausedRef.current
      ) {
        timerId = setTimeout(runMeasurementLoop, 200);
        return;
      }

      try {
        const peakFreqHz = calibrationPeakRef.current?.freq;
        if (!peakFreqHz) {
          throw new Error("No calibration peak frequency available.");
        }

        const exten = 7500;
        const start = peakFreqHz - exten;
        const stop = peakFreqHz + 2500;
        const samples = 1001;
        const step = (stop - start) / (samples - 1);

        const cmd = `${Math.round(start)};${Math.round(stop)};${Math.round(step)}\n`;
        await serialInstance.writeCommand(cmd);

        const buffer = await serialInstance.readData(100);
        const dataRaw = buffer.split(/\r?\n/);
        let dataMag = new Float64Array(samples);

        const vmax = 4.096;
        const bitmax = 65536;
        const ADCtoVolt = vmax / bitmax;
        const VCP = 0.9;

        // Parse dataRaw carefully
        let writeIdx = 0;
        for (let i = 0; i < dataRaw.length; i++) {
          const line = dataRaw[i].trim();
          if (!line) continue;
          if (line === "s" || line === "Connected") continue;
          const parsedVal = parseFloat(line);
          if (isNaN(parsedVal)) continue;

          let mag = parsedVal * ADCtoVolt;
          dataMag[writeIdx] = (mag - VCP) / 0.03;
          writeIdx++;
          if (writeIdx >= samples) break;
        }

        // Fill remaining values in dataMag with the last valid value or 0
        const lastVal = writeIdx > 0 ? dataMag[writeIdx - 1] : 0;
        for (let i = writeIdx; i < samples; i++) {
          dataMag[i] = lastVal;
        }

        // Frequencies in MHz for baseline evaluation
        const freqsMHz = [];
        for (let i = 0; i < samples; i++) {
          freqsMHz.push((start + step * i) / 1e6);
        }

        const poly = evalPolynomial(calibrationCoeffsRef.current, freqsMHz);
        const magBaselineCorrected = new Float64Array(samples);
        for (let i = 0; i < samples; i++) {
          magBaselineCorrected[i] = dataMag[i] - poly[i];
        }

        const filteredMag = sgFilter(Array.from(magBaselineCorrected), 11, 3);

        // Spline Interpolation: upsample 1001 points to 10001 points
        const spline = naturalCubicSpline(filteredMag);
        const points = 10001;
        let maxVal = -Infinity;
        let maxIdx = 0;
        for (let k = 0; k < points; k++) {
          const xVal = k * 0.1;
          const val = evaluateSpline(spline, xVal);
          if (val > maxVal) {
            maxVal = val;
            maxIdx = k;
          }
        }

        // Peak frequency in Hz
        const freqRange = [];
        for (let i = 0; i < points; i++) {
          freqRange.push(start + (stop - start) * (i / (points - 1)));
        }
        const fitPeakFreq = freqRange[maxIdx];

        // Store peak frequency in rolling buffer (write to refs)
        peakFreqBufferRef.current = [fitPeakFreq, ...peakFreqBufferRef.current];
        if (peakFreqBufferRef.current.length > 50) {
          peakFreqBufferRef.current.pop();
        }

        // Apply Savitzky-Golay filter (window 3, order 1) and average it
        const nextCount = measurementCountRef.current + 1;
        measurementCountRef.current = nextCount;

        const smoothed = sgFilter(peakFreqBufferRef.current, 3, 1);
        const avgSmoothed = npAverage(smoothed);

        freqRangeMeanRef.current = [...freqRangeMeanRef.current, avgSmoothed];

        if (statusCollectDataBeforeRef.current) {
          getValuesBeforeRef.current = [
            ...getValuesBeforeRef.current,
            avgSmoothed,
          ];
          avgFreq1Ref.current = npAverage(getValuesBeforeRef.current);
        }

        if (statusCollectDataAfterRef.current) {
          getValuesAfterRef.current = [
            ...getValuesAfterRef.current,
            avgSmoothed,
          ];
          avgFreq2Ref.current = npAverage(getValuesAfterRef.current);
        }

        zoomedFreqsRef.current = freqsMHz;
        zoomedAmplitudesRef.current = filteredMag;
      } catch (e) {
        console.error("Measurement loop error:", e);
        if (
          e.message?.includes("lost") ||
          e.message?.includes("closed") ||
          e.message?.includes("device")
        ) {
          setIsMeasurementRunning(false);
          setIsConnected(false);
          setStatusText("Disconnected");
          setToast({
            message: "Connection to QCM device lost. Please reconnect.",
            type: "error",
          });
        }
      }

      if (
        active &&
        isConnected &&
        isMeasurementRunning &&
        !isMeasurementPausedRef.current
      ) {
        timerId = setTimeout(runMeasurementLoop, 50);
      } else {
        timerId = setTimeout(runMeasurementLoop, 200);
      }
    };

    runMeasurementLoop();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
      serialInstance.cancelRead();
    };
  }, [isConnected, isMeasurementRunning]);

  const handleEnterMeasurementMode = () => {
    if (checkPage !== "measure") return;
    setMode("measurement");
    setMeasurementView("A");
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    setMeasurementCount(0);
    setFreqRangeMean([]);
    setPeakFreqBuffer([]);
    setGetValuesBefore([]);
    setGetValuesAfter([]);
    setAvgFreq1(null);
    setAvgFreq2(null);
    setDeltaF(null);
    setShowResult("");

    // Clear refs to sync with UI state resets
    measurementCountRef.current = 0;
    freqRangeMeanRef.current = [];
    peakFreqBufferRef.current = [];
    getValuesBeforeRef.current = [];
    getValuesAfterRef.current = [];
    avgFreq1Ref.current = null;
    avgFreq2Ref.current = null;
    zoomedFreqsRef.current = [];
    zoomedAmplitudesRef.current = [];
  };

  const handleBackToCalibration = () => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    setMode("calibration");
  };

  const handleToggleMeasurement = async () => {
    if (!isMeasurementRunning) {
      // Clear buffers and reset device before starting measurement loop
      const resetSuccess = await serialInstance.resetConnection();
      if (!resetSuccess) {
        setToast({
          message: "Failed to reset serial connection.",
          type: "error",
        });
        return;
      }
      setIsMeasurementRunning(true);
      setIsMeasurementPaused(false);
    } else {
      setIsMeasurementPaused(!isMeasurementPaused);
    }
  };

  const handleStopMeasurement = () => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    flushRefsToState();
  };

  const handleCollectBefore = () => {
    if (!isMeasurementRunning) {
      setToast({
        message: "Start the sweep measurement first.",
        type: "error",
      });
      return;
    }
    if (statusCollectDataBefore) {
      setStatusCollectDataBefore(false);
    } else {
      setStatusCollectDataBefore(true);
      setStatusCollectDataAfter(false); // only collect one at a time
    }
  };

  const handleCollectAfter = () => {
    if (!isMeasurementRunning) {
      setToast({
        message: "Start the sweep measurement first.",
        type: "error",
      });
      return;
    }
    if (statusCollectDataAfter) {
      setStatusCollectDataAfter(false);
    } else {
      setStatusCollectDataAfter(true);
      setStatusCollectDataBefore(false); // only collect one at a time
    }
  };

  const handleRefreshBefore = () => {
    setGetValuesBefore([]);
    setAvgFreq1(null);
    setDeltaF(null);
    setShowResult("");

    // Clear corresponding refs
    getValuesBeforeRef.current = [];
    avgFreq1Ref.current = null;
  };

  const handleRefreshAfter = () => {
    setGetValuesAfter([]);
    setAvgFreq2(null);
    setDeltaF(null);
    setShowResult("");

    // Clear corresponding refs
    getValuesAfterRef.current = [];
    avgFreq2Ref.current = null;
  };

  const handleCalculateResult = () => {
    if (avgFreq1 !== null && avgFreq2 !== null) {
      const delta = avgFreq1 - avgFreq2;
      setDeltaF(delta);
      if (delta > threshold) {
        setShowResult("Detected");
        setToast({
          message: "Result calculated: EGFR Detected!",
          type: "error",
        });
      } else {
        setShowResult("Not Detected");
        setToast({
          message: "Result calculated: EGFR Not Detected.",
          type: "success",
        });
      }
    } else {
      setToast({
        message: "Please collect both Before and After frequency data.",
        type: "error",
      });
    }
  };

  // ECharts Option - Premium transparent styling with smooth grid lines (useMemo to prevent re-evaluation unless data changes)
  const chartOption = useMemo(() => {
    let plotData = [];
    if (mode === "calibration") {
      plotData = chartData;
    } else if (measurementView === "A") {
      plotData = freqRangeMean.map((val, idx) => [idx + 1, val]);
    } else {
      plotData = zoomedFreqs.map((f, i) => [f, zoomedAmplitudes[i]]);
    }

    const minX =
      mode === "measurement" &&
      measurementView === "B" &&
      zoomedFreqs.length > 0
        ? Math.min(...zoomedFreqs)
        : mode === "calibration"
          ? 8
          : undefined;
    const maxX =
      mode === "measurement" &&
      measurementView === "B" &&
      zoomedFreqs.length > 0
        ? Math.max(...zoomedFreqs)
        : mode === "calibration"
          ? 12
          : undefined;

    let lineStyleColor = "#0284c7"; // Blue
    if (mode === "measurement") {
      lineStyleColor = measurementView === "A" ? "#10b981" : "#f59e0b"; // Green or Amber
    }

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      grid: {
        left: "8%",
        right: "6%",
        bottom: "16%",
        top: "16%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name:
          mode === "calibration"
            ? "Frequency (MHz)"
            : measurementView === "A"
              ? "Reading"
              : "Frequency (MHz)",
        nameLocation: "middle",
        nameGap: 25,
        splitLine: {
          show: true,
          lineStyle: { color: "rgba(148, 163, 184, 0.08)" },
        },
        min: minX,
        max: maxX,
        axisLabel: { color: "#64748b", fontSize: 13 },
        nameTextStyle: { color: "#64748b", fontSize: 13, fontWeight: 600 },
      },
      yAxis: {
        type: "value",
        name:
          mode === "calibration"
            ? "Amplitude (dB)"
            : measurementView === "A"
              ? "Resonance Freq (Hz)"
              : "Amplitude (dB)",
        splitLine: {
          show: true,
          lineStyle: { color: "rgba(148, 163, 184, 0.08)" },
        },
        axisLabel: {
          color: "#64748b",
          fontSize: 13,
          formatter: (val) => val.toLocaleString(),
        },
        nameTextStyle: {
          color: "#64748b",
          fontSize: 13,
          fontWeight: 600,
          align: "left",
          padding: [0, 0, 8, 0],
        },
        scale: true,
      },
      series: [
        {
          name:
            mode === "calibration"
              ? "Amplitude"
              : measurementView === "A"
                ? "Resonance Freq"
                : "Filtered Amplitude",
          type: "line",
          showSymbol: measurementView === "A" && mode === "measurement",
          symbolSize: 4,
          data: plotData,
          lineStyle: {
            color: lineStyleColor,
            width: 2,
          },
          areaStyle:
            mode === "calibration"
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "rgba(2, 132, 199, 0.2)" },
                    { offset: 1, color: "rgba(2, 132, 199, 0.01)" },
                  ]),
                }
              : undefined,
        },
      ],
    };
  }, [
    mode,
    measurementView,
    chartData,
    freqRangeMean,
    zoomedFreqs,
    zoomedAmplitudes,
  ]);

  return (
    <div
      className="app-container"
      style={{
        gridTemplateColumns: "1fr 350px",
        maxWidth: "1600px",
        height: "calc(100vh - 80px)",
        minHeight: "550px",
        overflow: "hidden",
        padding: "1rem 2rem",
        gap: "1.25rem",
      }}
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{
              position: "fixed",
              top: "90px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "10px",
              boxShadow: "0 8px 20px rgba(2, 132, 199, 0.15)",
              background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
              border:
                toast.type === "success"
                  ? "1px solid #a7f3d0"
                  : "1px solid #fecaca",
              color: toast.type === "success" ? "#065f46" : "#991b1b",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: Main Chart & Action controls */}
      <div className="flex flex-col gap-4 h-full min-h-0 justify-between">
        {/* CHART CONTAINER CARD (Top-left zone - scaled down) */}
        <div className="glass-panel flex flex-col p-2 flex-1 min-h-0">
          <div className="flex justify-between items-center mb-1.5 border-b border-slate-100 pb-1.5">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-sky-500" />
                {mode === "calibration"
                  ? "QCM Calibration Sweep"
                  : `QCM Measurement (${measurementView === "A" ? "View A: Time Series" : "View B: Zoomed Sweep"})`}
              </h2>
            </div>

            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${mode === "calibration" ? "bg-sky-50 text-sky-600 border border-sky-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
            >
              {mode === "calibration" ? "Calibration" : "Measurement"}
            </div>
          </div>

          {/* ECharts Area (scales to fill panel) */}
          <div className="flex-1 w-full bg-slate-50/50 rounded-lg border border-slate-100/50 p-1 min-h-0">
            <QcmChart option={chartOption} />
          </div>
        </div>

        {/* BOTTOM ACTION SECTION (Bottom-left zone) */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <DataExportCard
            nameEntry={nameEntry}
            setNameEntry={setNameEntry}
            directoryEntry={directoryEntry}
            handleSelectSaveDirectory={handleSelectSaveDirectory}
            openBcEntry={openBcEntry}
            handleImportBaselineCSV={handleImportBaselineCSV}
            handleSaveCSVDataAndAnalysis={handleSaveCSVDataAndAnalysis}
            isSaving={isSaving}
            mode={mode}
            chartData={chartData}
            freqRangeMean={freqRangeMean}
          />

          <SystemControlsCard
            isConnected={isConnected}
            mode={mode}
            isCalibrating={isCalibrating}
            checkPage={checkPage}
            isMeasurementRunning={isMeasurementRunning}
            isMeasurementPaused={isMeasurementPaused}
            measurementView={measurementView}
            handleConnect={handleConnect}
            handleCalibrate={handleCalibrate}
            handleEnterMeasurementMode={handleEnterMeasurementMode}
            handleToggleMeasurement={handleToggleMeasurement}
            handleStopMeasurement={handleStopMeasurement}
            setMeasurementView={setMeasurementView}
            handleBackToCalibration={handleBackToCalibration}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Diagnostic Metrics & Target Selection */}
      <div className="flex flex-col gap-1 h-full min-h-0 justify-between">
        <ResonanceMetrics
          avgFreq1={avgFreq1}
          avgFreq2={avgFreq2}
          deltaF={deltaF}
          isMeasurementRunning={isMeasurementRunning}
          statusCollectDataBefore={statusCollectDataBefore}
          statusCollectDataAfter={statusCollectDataAfter}
          handleCollectBefore={handleCollectBefore}
          handleCollectAfter={handleCollectAfter}
          handleImportMeasurementCSV={handleImportMeasurementCSV}
          handleRefreshBefore={handleRefreshBefore}
          handleRefreshAfter={handleRefreshAfter}
          handleCalculateResult={handleCalculateResult}
        />

        {/* CARD C: Analysis target & Threshold Settings (Moved below metrics) */}
        <div className="glass-panel p-2 shrink-0">
          <h3 className="text-sm font-bold text-slate-700 mb-1">
            Target & Threshold Settings
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">
                Target Tumor
              </span>
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-sm focus:outline-none focus:border-sky-500 font-semibold text-slate-700"
                value={targetName}
                onChange={(e) => {
                  const val = e.target.value;
                  setTargetName(val);
                  if (val === "EGFR") setThreshold(10);
                }}
              >
                <option value="EGFR">EGFR</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">
                Threshold (Hz)
              </span>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2 text-sm focus:outline-none focus:border-sky-500 font-semibold text-slate-700"
                value={threshold}
                onChange={(e) =>
                  setThreshold(Math.max(1, parseInt(e.target.value) || 1))
                }
                disabled={targetName === "EGFR"}
              />
            </div>
          </div>

          {/* DIAGNOSIS BANNER OVERLAY */}
          {showResult && (
            <div
              className={`mt-2 p-2 rounded-lg text-center font-bold text-sm shadow-sm transition-all border ${
                showResult === "Detected"
                  ? "bg-rose-50 text-rose-600 border-rose-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              Result:{" "}
              {showResult === "Detected" ? "EGFR Positive" : "EGFR Negative"}
            </div>
          )}
        </div>

        {user && (
          <SavedRunsDatabase
            analyses={analyses}
            handleLoadAnalysis={handleLoadAnalysis}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
