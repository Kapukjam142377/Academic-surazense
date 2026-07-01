import { useState, useRef, useEffect } from "react";
import { serialInstance } from "../utils/serialService";
import {
  sgFilter,
  naturalCubicSpline,
  evaluateSpline,
  evalPolynomial,
  npAverage,
} from "../utils/mathUtils";

/**
 * useMeasurementLoop
 * Manages the real-time QCM frequency sweep loop, all high-frequency Refs
 * (written in the loop to avoid React re-renders), the 150ms throttled state
 * flush to React state, and all measurement-phase handlers.
 *
 * IMPORTANT: calibrationPeakRef and calibrationCoeffsRef MUST be the Refs
 * returned by useCalibration (not the state values) to avoid stale closures
 * in the async measurement loop.
 *
 * @param {Object}    params
 * @param {boolean}   params.isConnected        - Serial connection state
 * @param {React.MutableRefObject} params.calibrationPeakRef   - Ref to current calibration peak
 * @param {React.MutableRefObject} params.calibrationCoeffsRef - Ref to calibration polynomial coeffs
 * @param {Function}  params.setToast           - Toast notification setter
 * @param {Function}  params.setIsConnected     - Setter for isConnected (to mark disconnect on error)
 * @param {Function}  params.setStatusText      - Setter for statusText (to mark disconnect on error)
 */
export function useMeasurementLoop({
  isConnected,
  calibrationPeakRef,
  calibrationCoeffsRef,
  setToast,
  setIsConnected,
  setStatusText,
}) {
  // ── React State (UI-visible, updated every 150ms from refs) ─────────────
  const [isMeasurementRunning, setIsMeasurementRunning] = useState(false);
  const [isMeasurementPaused, setIsMeasurementPaused] = useState(false);
  const [measurementCount, setMeasurementCount] = useState(0);
  const [freqRangeMean, setFreqRangeMean] = useState([]);
  const [peakFreqBuffer, setPeakFreqBuffer] = useState([]);
  const [getValuesBefore, setGetValuesBefore] = useState([]);
  const [getValuesAfter, setGetValuesAfter] = useState([]);
  const [avgFreq1, setAvgFreq1] = useState(null);
  const [avgFreq2, setAvgFreq2] = useState(null);
  const [statusCollectDataBefore, setStatusCollectDataBefore] = useState(false);
  const [statusCollectDataAfter, setStatusCollectDataAfter] = useState(false);
  const [zoomedFreqs, setZoomedFreqs] = useState([]);
  const [zoomedAmplitudes, setZoomedAmplitudes] = useState([]);

  // ── Refs (written directly by async loop, flushed to state every 150ms) ─
  const freqRangeMeanRef = useRef([]);
  const peakFreqBufferRef = useRef([]);
  const zoomedFreqsRef = useRef([]);
  const zoomedAmplitudesRef = useRef([]);
  const measurementCountRef = useRef(0);
  const getValuesBeforeRef = useRef([]);
  const getValuesAfterRef = useRef([]);
  const avgFreq1Ref = useRef(null);
  const avgFreq2Ref = useRef(null);

  // Refs for loop control variables (checked inside async loop without stale closure issues)
  const isMeasurementPausedRef = useRef(isMeasurementPaused);
  const statusCollectDataBeforeRef = useRef(statusCollectDataBefore);
  const statusCollectDataAfterRef = useRef(statusCollectDataAfter);

  // Sync state → loop-control refs
  useEffect(() => {
    isMeasurementPausedRef.current = isMeasurementPaused;
  }, [isMeasurementPaused]);
  useEffect(() => {
    statusCollectDataBeforeRef.current = statusCollectDataBefore;
  }, [statusCollectDataBefore]);
  useEffect(() => {
    statusCollectDataAfterRef.current = statusCollectDataAfter;
  }, [statusCollectDataAfter]);

  // ── Flush refs → React state (batched every 150ms) ──────────────────────
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

  useEffect(() => {
    if (!isMeasurementRunning) return;
    const intervalId = setInterval(flushRefsToState, 150);
    return () => clearInterval(intervalId);
  }, [isMeasurementRunning]);

  // ── Real-time QCM sweep loop ─────────────────────────────────────────────
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
        if (!peakFreqHz)
          throw new Error("No calibration peak frequency available.");

        const exten = 7500;
        const start = peakFreqHz - exten;
        const stop = peakFreqHz + 2500;
        const samples = 1001;
        const step = (stop - start) / (samples - 1);

        await serialInstance.writeCommand(
          `${Math.round(start)};${Math.round(stop)};${Math.round(step)}\n`,
        );

        const buffer = await serialInstance.readData(100);
        const dataRaw = buffer.split(/\r?\n/);
        const dataMag = new Float64Array(samples);

        const vmax = 4.096;
        const bitmax = 65536;
        const ADCtoVolt = vmax / bitmax;
        const VCP = 0.9;

        let writeIdx = 0;
        for (let i = 0; i < dataRaw.length; i++) {
          const line = dataRaw[i].trim();
          if (!line || line === "s" || line === "Connected") continue;
          const parsedVal = parseFloat(line);
          if (isNaN(parsedVal)) continue;
          dataMag[writeIdx] = (parsedVal * ADCtoVolt - VCP) / 0.03;
          writeIdx++;
          if (writeIdx >= samples) break;
        }

        // Pad remaining samples with last valid value
        const lastVal = writeIdx > 0 ? dataMag[writeIdx - 1] : 0;
        for (let i = writeIdx; i < samples; i++) dataMag[i] = lastVal;

        // Build frequency array in MHz
        const freqsMHz = [];
        for (let i = 0; i < samples; i++) {
          freqsMHz.push((start + step * i) / 1e6);
        }

        // Subtract polynomial baseline
        const poly = evalPolynomial(calibrationCoeffsRef.current, freqsMHz);
        const magBaselineCorrected = new Float64Array(samples);
        for (let i = 0; i < samples; i++) {
          magBaselineCorrected[i] = dataMag[i] - poly[i];
        }

        // Savitzky-Golay filter (window=11, order=3)
        const filteredMag = sgFilter(Array.from(magBaselineCorrected), 11, 3);

        // Cubic spline interpolation: upsample 1001 → 10001 points to find peak precisely
        const spline = naturalCubicSpline(filteredMag);
        const points = 10001;
        let maxVal = -Infinity;
        let maxIdx = 0;
        for (let k = 0; k < points; k++) {
          const val = evaluateSpline(spline, k * 0.1);
          if (val > maxVal) {
            maxVal = val;
            maxIdx = k;
          }
        }

        const freqRange = Array.from(
          { length: points },
          (_, i) => start + (stop - start) * (i / (points - 1)),
        );
        const fitPeakFreq = freqRange[maxIdx];

        // Rolling buffer of recent peak frequencies (max 50 entries)
        peakFreqBufferRef.current = [fitPeakFreq, ...peakFreqBufferRef.current];
        if (peakFreqBufferRef.current.length > 50)
          peakFreqBufferRef.current.pop();

        measurementCountRef.current += 1;

        // Smooth with SG(3,1) and average
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

  // ── Internal helper: reset all measurement state + refs ─────────────────
  const _resetAllMeasurementData = () => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    setMeasurementCount(0);
    setFreqRangeMean([]);
    setPeakFreqBuffer([]);
    setGetValuesBefore([]);
    setGetValuesAfter([]);
    setAvgFreq1(null);
    setAvgFreq2(null);
    setZoomedFreqs([]);
    setZoomedAmplitudes([]);
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

  // ── Public Handlers ──────────────────────────────────────────────────────

  /**
   * Enter measurement mode from calibration. Requires checkPage === 'measure'.
   * @param {string}   checkPage - Current calibration gate state
   * @param {Function} setMode   - Dashboard mode setter
   * @param {Function} setMeasurementView - Dashboard view setter
   */
  const handleEnterMeasurementMode = (
    checkPage,
    setMode,
    setMeasurementView,
  ) => {
    if (checkPage !== "measure") return;
    _resetAllMeasurementData();
    setMode("measurement");
    setMeasurementView("A");
  };

  /**
   * Return to calibration mode and stop any running measurement.
   * @param {Function} setMode - Dashboard mode setter
   */
  const handleBackToCalibration = (setMode) => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    setMode("calibration");
  };

  /** Start or pause/resume the sweep measurement */
  const handleToggleMeasurement = async () => {
    if (!isMeasurementRunning) {
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
      setIsMeasurementPaused((prev) => !prev);
    }
  };

  /** Stop measurement and flush latest ref values to React state */
  const handleStopMeasurement = () => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    flushRefsToState();
  };

  /** Toggle "Collect Before" accumulation (mutually exclusive with After) */
  const handleCollectBefore = () => {
    if (!isMeasurementRunning) {
      setToast({
        message: "Start the sweep measurement first.",
        type: "error",
      });
      return;
    }
    setStatusCollectDataBefore((prev) => {
      if (!prev) setStatusCollectDataAfter(false); // only one at a time
      return !prev;
    });
  };

  /** Toggle "Collect After" accumulation (mutually exclusive with Before) */
  const handleCollectAfter = () => {
    if (!isMeasurementRunning) {
      setToast({
        message: "Start the sweep measurement first.",
        type: "error",
      });
      return;
    }
    setStatusCollectDataAfter((prev) => {
      if (!prev) setStatusCollectDataBefore(false); // only one at a time
      return !prev;
    });
  };

  /** Clear the "Before" buffer and its corresponding ref */
  const handleRefreshBefore = () => {
    setGetValuesBefore([]);
    setAvgFreq1(null);
    getValuesBeforeRef.current = [];
    avgFreq1Ref.current = null;
  };

  /** Clear the "After" buffer and its corresponding ref */
  const handleRefreshAfter = () => {
    setGetValuesAfter([]);
    setAvgFreq2(null);
    getValuesAfterRef.current = [];
    avgFreq2Ref.current = null;
  };

  /** Import a previously saved measurement CSV (Before or After column) */
  const handleImportMeasurementCSV = (e, type) => {
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

        const values = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length >= 3) {
            const val = parseFloat(row[2]);
            if (!isNaN(val)) values.push(val);
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
            message: `Loaded Before CSV: ${values.length} samples, avg ${Math.round(avg).toLocaleString()} Hz`,
            type: "success",
          });
        } else {
          setGetValuesAfter(values);
          setAvgFreq2(avg);
          setToast({
            message: `Loaded After CSV: ${values.length} samples, avg ${Math.round(avg).toLocaleString()} Hz`,
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

  return {
    // State
    isMeasurementRunning,
    isMeasurementPaused,
    measurementCount,
    freqRangeMean,
    peakFreqBuffer,
    getValuesBefore,
    getValuesAfter,
    avgFreq1,
    avgFreq2,
    statusCollectDataBefore,
    statusCollectDataAfter,
    zoomedFreqs,
    zoomedAmplitudes,
    // Handlers
    handleEnterMeasurementMode,
    handleBackToCalibration,
    handleToggleMeasurement,
    handleStopMeasurement,
    handleCollectBefore,
    handleCollectAfter,
    handleRefreshBefore,
    handleRefreshAfter,
    handleImportMeasurementCSV,
    flushRefsToState,
  };
}
