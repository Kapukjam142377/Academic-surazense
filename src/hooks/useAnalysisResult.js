import { useState, useEffect } from "react";

/**
 * useAnalysisResult
 * Manages EGFR analysis results: threshold, deltaF, detection result,
 * and cloud save/load of analysis runs via the backend API.
 *
 * @param {Object} params
 * @param {Object|null} params.user           - Logged-in user object
 * @param {number|null} params.avgFreq1       - Average "before" frequency (from useMeasurementLoop)
 * @param {number|null} params.avgFreq2       - Average "after" frequency (from useMeasurementLoop)
 * @param {string}      params.mode           - Current mode: 'calibration' | 'measurement'
 * @param {number[]}    params.freqRangeMean  - Time-series resonance freq array (from useMeasurementLoop)
 * @param {Array}       params.chartData      - Calibration chart data (from useCalibration)
 * @param {Function}    params.setToast       - Toast notification setter from Dashboard
 */
export function useAnalysisResult({
  user,
  avgFreq1,
  avgFreq2,
  mode,
  freqRangeMean,
  chartData,
  setToast,
}) {
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://34.87.78.35:8000");

  const [threshold, setThreshold] = useState(10); // Hz, default EGFR threshold
  const [targetName, setTargetName] = useState("EGFR");
  const [showResult, setShowResult] = useState(""); // 'Detected' | 'Not Detected' | ''
  const [deltaF, setDeltaF] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved analyses whenever the logged-in user changes
  useEffect(() => {
    if (user) {
      fetchAnalyses();
    } else {
      setAnalyses([]);
    }
  }, [user]);

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

  /** Reset result flags — called externally when refreshing Before/After data */
  const resetResult = () => {
    setDeltaF(null);
    setShowResult("");
  };

  /** Calculate ΔF and determine if EGFR is detected */
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

  /** Save the current run (calibration or measurement) to the backend */
  const handleSaveAnalysis = async () => {
    if (!user) return;
    const title = window.prompt(
      "Enter a title for this run:",
      `QCM Run ${new Date().toLocaleTimeString()}`,
    );
    if (!title) return;

    const isMeasureRun = mode === "measurement";
    setIsSaving(true);

    try {
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

      if (!res.ok) throw new Error("Failed to save analysis");

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

  return {
    // State
    threshold,
    setThreshold,
    targetName,
    setTargetName,
    showResult,
    setShowResult,
    deltaF,
    setDeltaF,
    analyses,
    setAnalyses,
    isSaving,
    // Handlers
    resetResult,
    handleCalculateResult,
    handleSaveAnalysis,
    fetchAnalyses,
  };
}
