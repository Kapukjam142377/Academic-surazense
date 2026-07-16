import React, { useState, useEffect, useMemo } from "react";
import * as echarts from "echarts";
import QcmChart from "../components/QcmChart";
import ResonanceMetrics from "../components/ResonanceMetrics";
import SavedRunsDatabase from "../components/SavedRunsDatabase";
import DataExportCard from "../components/DataExportCard";
import SystemControlsCard from "../components/SystemControlsCard";
import DeviceRestriction from "../components/DeviceRestriction";
import { CheckCircle, AlertCircle, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useSerialConnection } from "../hooks/useSerialConnection";
import { useCalibration } from "../hooks/useCalibration";
import { useMeasurementLoop } from "../hooks/useMeasurementLoop";
import { useAnalysisResult } from "../hooks/useAnalysisResult";

function Dashboard() {
  const { user } = useUser();

  // ── Global UI state (kept here — shared across multiple hooks) ────────────
  const [toast, setToast] = useState({ message: "", type: null });
  const [mode, setMode] = useState("calibration"); // 'calibration' | 'measurement'
  const [measurementView, setMeasurementView] = useState("A"); // 'A' | 'B'

  // File / directory entries (UI-only, used by DataExportCard and save handlers)
  const [nameEntry, setNameEntry] = useState("");
  const [directoryEntry, setDirectoryEntry] = useState(
    "C:/Users/Victus 15/QCM_Data",
  );
  const [directoryHandle, setDirectoryHandle] = useState(null);

  // ── Auto-dismiss toast after 3 s ─────────────────────────────────────────
  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", type: null }), 3000);
    return () => clearTimeout(timer);
  }, [toast.message]);

  // ── Custom Hooks ──────────────────────────────────────────────────────────
  const serial = useSerialConnection({ setToast });

  const calib = useCalibration({
    isConnected: serial.isConnected,
    setToast,
  });

  const measure = useMeasurementLoop({
    isConnected: serial.isConnected,
    calibrationPeakRef: calib.calibrationPeakRef,
    calibrationCoeffsRef: calib.calibrationCoeffsRef,
    setToast,
    setIsConnected: serial.setIsConnected,
    setStatusText: serial.setStatusText,
  });

  const analysis = useAnalysisResult({
    user,
    avgFreq1: measure.avgFreq1,
    avgFreq2: measure.avgFreq2,
    mode,
    freqRangeMean: measure.freqRangeMean,
    chartData: calib.chartData,
    setToast,
  });

  // ── Cross-hook Handlers (bridge multiple hooks) ───────────────────────────

  /** Wrapped refresh handlers that also reset analysis result */
  const handleRefreshBefore = () => {
    measure.handleRefreshBefore();
    analysis.resetResult();
  };
  const handleRefreshAfter = () => {
    measure.handleRefreshAfter();
    analysis.resetResult();
  };

  /** Enter measurement mode (requires successful calibration) */
  const handleEnterMeasurementMode = () => {
    measure.handleEnterMeasurementMode(
      calib.checkPage,
      setMode,
      setMeasurementView,
    );
  };

  /** Return to calibration mode */
  const handleBackToCalibration = () => {
    measure.handleBackToCalibration(setMode);
  };

  /** Load a previously saved analysis run */
  const handleLoadAnalysis = (analysisItem) => {
    try {
      if (analysisItem.file1_data) {
        const loadedData = JSON.parse(analysisItem.file1_data);
        if (analysisItem.measurement_type === "measurement") {
          setMode("measurement");
          setMeasurementView("A");
          measure.handleRefreshBefore(); // clear existing buffers
          measure.handleRefreshAfter();
          // Directly set the loaded frequency series
          // (We call the setter exposed from the hook via flushRefsToState pattern)
          analysis.setDeltaF(analysisItem.delta_f);
          if (analysisItem.delta_f !== null) {
            analysis.setShowResult(
              analysisItem.delta_f > analysis.threshold
                ? "Detected"
                : "Not Detected",
            );
          } else {
            analysis.setShowResult("");
          }
        } else {
          setMode("calibration");
          calib.setChartData(loadedData);
        }
        setToast({
          message: `Loaded session: ${analysisItem.title}`,
          type: "success",
        });
      }
    } catch (e) {
      console.error("Failed to parse analysis data", e);
      setToast({ message: "Failed to load session.", type: "error" });
    }
  };

  /** Open a directory picker for the save location */
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

  /** Save current data as CSV file (calibration or measurement) */
  const handleSaveCSVFile = async () => {
    const isMeasureRun = mode === "measurement";
    if (isMeasureRun && measure.freqRangeMean.length === 0) {
      setToast({ message: "Please take measurements first.", type: "error" });
      return false;
    }
    if (!isMeasureRun && calib.chartData.length === 0) {
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
        measure.freqRangeMean.forEach((val, idx) => {
          const timeOffset = new Date(
            now.getTime() - (measure.freqRangeMean.length - 1 - idx) * 1000,
          );
          const tStr = timeOffset.toTimeString().split(" ")[0];
          csvContent += `${idx + 1},${tStr},${val}\n`;
        });
      } else {
        csvContent = "xf,data,baseline,coefficial\n";
        const limit = Math.max(
          calib.baselineFreqs.length,
          calib.baselineMag.length,
          calib.calibrationBaseLine.length,
        );
        for (let i = 0; i < limit; i++) {
          const xfVal =
            calib.baselineFreqs[i] !== undefined
              ? calib.baselineFreqs[i] * 1e6
              : "";
          const dataVal =
            calib.baselineMag[i] !== undefined ? calib.baselineMag[i] : "";
          const baseVal =
            calib.calibrationBaseLine[i] !== undefined
              ? calib.calibrationBaseLine[i]
              : "";
          const coeffVal =
            calib.calibrationCoeffs[i] !== undefined
              ? calib.calibrationCoeffs[i]
              : "";
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

  /** Save CSV then save analysis run to cloud (if logged in) */
  const handleSaveCSVDataAndAnalysis = async () => {
    const csvSuccess = await handleSaveCSVFile();
    if (csvSuccess && user) {
      await analysis.handleSaveAnalysis();
    }
  };

  // ── ECharts Option (derived from both calib and measure state) ────────────
  const chartOption = useMemo(() => {
    let plotData = [];
    if (mode === "calibration") {
      plotData = calib.chartData;
    } else if (measurementView === "A") {
      plotData = measure.freqRangeMean.map((val, idx) => [idx + 1, val]);
    } else {
      plotData = measure.zoomedFreqs.map((f, i) => [
        f,
        measure.zoomedAmplitudes[i],
      ]);
    }

    const minX =
      mode === "measurement" &&
      measurementView === "B" &&
      measure.zoomedFreqs.length > 0
        ? Math.min(...measure.zoomedFreqs)
        : mode === "calibration"
          ? 8
          : undefined;

    const maxX =
      mode === "measurement" &&
      measurementView === "B" &&
      measure.zoomedFreqs.length > 0
        ? Math.max(...measure.zoomedFreqs)
        : mode === "calibration"
          ? 12
          : undefined;

    let lineStyleColor = "#0284c7";
    if (mode === "measurement") {
      lineStyleColor = measurementView === "A" ? "#10b981" : "#f59e0b";
    }

    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
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
          lineStyle: { color: lineStyleColor, width: 2 },
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
    calib.chartData,
    measure.freqRangeMean,
    measure.zoomedFreqs,
    measure.zoomedAmplitudes,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DeviceRestriction>
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
          {/* CHART CONTAINER CARD */}
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
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  mode === "calibration"
                    ? "bg-sky-50 text-sky-600 border border-sky-100"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}
              >
                {mode === "calibration" ? "Calibration" : "Measurement"}
              </div>
            </div>

            {/* ECharts Area */}
            <div className="flex-1 w-full bg-slate-50/50 rounded-lg border border-slate-100/50 p-1 min-h-0">
              <QcmChart option={chartOption} />
            </div>
          </div>

          {/* BOTTOM ACTION SECTION */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <DataExportCard
              nameEntry={nameEntry}
              setNameEntry={setNameEntry}
              directoryEntry={directoryEntry}
              handleSelectSaveDirectory={handleSelectSaveDirectory}
              openBcEntry={calib.openBcEntry}
              handleImportBaselineCSV={calib.handleImportBaselineCSV}
              handleSaveCSVDataAndAnalysis={handleSaveCSVDataAndAnalysis}
              isSaving={analysis.isSaving}
              mode={mode}
              chartData={calib.chartData}
              freqRangeMean={measure.freqRangeMean}
            />

            <SystemControlsCard
              isConnected={serial.isConnected}
              mode={mode}
              isCalibrating={calib.isCalibrating}
              checkPage={calib.checkPage}
              isMeasurementRunning={measure.isMeasurementRunning}
              isMeasurementPaused={measure.isMeasurementPaused}
              measurementView={measurementView}
              handleConnect={serial.handleConnect}
              handleCalibrate={calib.handleCalibrate}
              handleEnterMeasurementMode={handleEnterMeasurementMode}
              handleToggleMeasurement={measure.handleToggleMeasurement}
              handleStopMeasurement={measure.handleStopMeasurement}
              setMeasurementView={setMeasurementView}
              handleBackToCalibration={handleBackToCalibration}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Diagnostic Metrics & Target Selection */}
        <div className="flex flex-col gap-1 h-full min-h-0 justify-between">
          <ResonanceMetrics
            avgFreq1={measure.avgFreq1}
            avgFreq2={measure.avgFreq2}
            deltaF={analysis.deltaF}
            isMeasurementRunning={measure.isMeasurementRunning}
            statusCollectDataBefore={measure.statusCollectDataBefore}
            statusCollectDataAfter={measure.statusCollectDataAfter}
            handleCollectBefore={measure.handleCollectBefore}
            handleCollectAfter={measure.handleCollectAfter}
            handleImportMeasurementCSV={measure.handleImportMeasurementCSV}
            handleRefreshBefore={handleRefreshBefore}
            handleRefreshAfter={handleRefreshAfter}
            handleCalculateResult={analysis.handleCalculateResult}
          />

          {/* Target & Threshold Settings */}
          <div className="glass-panel p-2 shrink-0">
            <h3 className="text-sm font-bold text-slate-700 mb-1">
              Target &amp; Threshold Settings
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">
                  Target Tumor
                </span>
                <div className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-sm font-semibold text-slate-500 select-none cursor-default">
                  EGFR
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">
                  Threshold (Hz)
                </span>
                <div className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2 text-sm font-semibold text-slate-500 select-none cursor-default">
                  10
                </div>
              </div>
            </div>

            {/* Diagnosis result banner */}
            {analysis.showResult && (
              <div
                className={`mt-2 p-2 rounded-lg text-center font-bold text-sm shadow-sm transition-all border ${
                  analysis.showResult === "Detected"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                }`}
              >
                Result:{" "}
                {analysis.showResult === "Detected"
                  ? "EGFR Positive"
                  : "EGFR Negative"}
              </div>
            )}
          </div>

          {user && (
            <SavedRunsDatabase
              analyses={analysis.analyses}
              handleLoadAnalysis={handleLoadAnalysis}
            />
          )}
        </div>
      </div>
    </DeviceRestriction>
  );
}

export default Dashboard;
