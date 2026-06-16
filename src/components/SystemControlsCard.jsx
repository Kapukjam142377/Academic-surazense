import React from "react";
import { Cpu, Pause, Play, Square, ArrowLeft, RefreshCw } from "lucide-react";

function SystemControlsCard({
  isConnected,
  mode,
  isCalibrating,
  checkPage,
  isMeasurementRunning,
  isMeasurementPaused,
  measurementView,
  handleConnect,
  handleCalibrate,
  handleEnterMeasurementMode,
  handleToggleMeasurement,
  handleStopMeasurement,
  setMeasurementView,
  handleBackToCalibration,
}) {
  return (
    <div className="glass-panel p-2 flex flex-col justify-between">
      {/* Title row — standalone, no border */}
      <h3 className="text-base font-bold text-slate-700 flex items-center gap-1 mb-1.5">
        <Cpu className="w-4 h-4 text-slate-500" />
        System Controls
      </h3>

      {/* Connection Status Box */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`status-dot !w-2 !h-2 shrink-0 ${isConnected ? "connected" : ""}`}
          ></div>
          <span className="text-xs font-bold text-slate-600 font-mono">
            {isConnected ? "COM3" : "No Port"}
          </span>
          <span
            className={`text-[11px] font-semibold ${isConnected ? "text-emerald-500" : "text-slate-400"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.location.reload()}
            className="p-1 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 transition-colors"
            title="Refresh page"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleConnect}
            className={`px-2.5 py-0.5 rounded-md text-sm font-bold transition-all border whitespace-nowrap ${isConnected ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200" : "bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-200"}`}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>

      {/* Sweep Trigger Buttons */}
      <div className="flex flex-col gap-1.5">
        {mode === "calibration" ? (
          <>
            <button
              className="btn btn-primary w-full !py-1.5 text-sm font-bold"
              onClick={handleCalibrate}
              disabled={isCalibrating || !isConnected}
            >
              {isCalibrating ? "Calibrating..." : "Start Calibration Sweep"}
            </button>

            <button
              className="btn btn-success w-full !py-1.5 text-sm font-bold"
              onClick={handleEnterMeasurementMode}
              disabled={checkPage !== "measure"}
            >
              Start Measurement Mode
            </button>
          </>
        ) : (
          <>
            {/* Measurement Mode Controls */}
            <div className="flex gap-1.5">
              <button
                className={`btn flex-1 !py-1.5 text-sm font-bold ${isMeasurementRunning && !isMeasurementPaused ? "btn-warning" : "btn-success"}`}
                onClick={handleToggleMeasurement}
              >
                {isMeasurementRunning && !isMeasurementPaused ? (
                  <span className="flex items-center gap-1">
                    <Pause className="w-4 h-4" /> Pause
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" /> Start Sweep
                  </span>
                )}
              </button>
              {isMeasurementRunning && (
                <button
                  className="btn btn-danger px-2.5 !py-1.5"
                  onClick={handleStopMeasurement}
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                className={`btn text-sm font-bold !py-1.5 ${measurementView === "A" ? "btn-primary" : "bg-slate-50"}`}
                onClick={() => setMeasurementView("A")}
              >
                View A (Freq)
              </button>
              <button
                className={`btn text-xs font-bold !py-1.5 ${measurementView === "B" ? "btn-primary" : "bg-slate-50"}`}
                onClick={() => setMeasurementView("B")}
              >
                View B (Spectrum)
              </button>
            </div>

            <button
              className="btn btn-outline w-full !py-1 text-sm font-semibold flex gap-1 items-center text-slate-600 justify-center"
              onClick={handleBackToCalibration}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Calibration
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SystemControlsCard;
