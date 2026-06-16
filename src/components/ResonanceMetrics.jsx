import React from "react";
import { Folder, RefreshCw } from "lucide-react";

function ResonanceMetrics({
  avgFreq1,
  avgFreq2,
  deltaF,
  isMeasurementRunning,
  statusCollectDataBefore,
  statusCollectDataAfter,
  handleCollectBefore,
  handleCollectAfter,
  handleImportMeasurementCSV,
  handleRefreshBefore,
  handleRefreshAfter,
  handleCalculateResult,
}) {
  return (
    <div className="glass-panel p-2 flex flex-col gap-1 shrink-0">
      <div className="flex justify-between items-center border-b border-slate-100 pb-0.5">
        <h3 className="text-base font-bold text-slate-700">
          Resonance Metrics
        </h3>
        <button
          onClick={handleCalculateResult}
          disabled={avgFreq1 === null || avgFreq2 === null}
          className="px-2.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-100 rounded-md text-sm font-bold transition-all"
        >
          Calculate
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {/* Before (Hz) Metric Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex justify-between items-center">
          <div>
            <span className="text-sm uppercase font-bold text-slate-400 block">
              Before
            </span>
            <span className="text-lg font-bold text-slate-700 font-mono">
              {avgFreq1 !== null
                ? `${Math.round(avgFreq1).toLocaleString()} Hz`
                : "--,--- Hz"}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleCollectBefore}
              disabled={!isMeasurementRunning}
              className={`px-2.5 py-0.5 rounded-md border text-sm font-bold transition-all ${
                statusCollectDataBefore
                  ? "bg-amber-100 border-amber-200 text-amber-600 animate-pulse"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              Collect
            </button>
            <label
              className="p-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 rounded-md transition-colors cursor-pointer flex items-center justify-center"
              title="Import Before CSV File"
            >
              <Folder className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleImportMeasurementCSV(e, "before")}
                className="hidden"
              />
            </label>
            <button
              onClick={handleRefreshBefore}
              className="p-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-md text-slate-400 transition-colors"
              title="Clear Before Data"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* After (Hz) Metric Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex justify-between items-center">
          <div>
            <span className="text-sm uppercase font-bold text-slate-400 block">
              After
            </span>
            <span className="text-lg font-bold text-slate-700 font-mono">
              {avgFreq2 !== null
                ? `${Math.round(avgFreq2).toLocaleString()} Hz`
                : "--,--- Hz"}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleCollectAfter}
              disabled={!isMeasurementRunning}
              className={`px-2.5 py-0.5 rounded-md border text-sm font-bold transition-all ${
                statusCollectDataAfter
                  ? "bg-amber-100 border-amber-200 text-amber-600 animate-pulse"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              Collect
            </button>
            <label
              className="p-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 rounded-md transition-colors cursor-pointer flex items-center justify-center"
              title="Import After CSV File"
            >
              <Folder className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleImportMeasurementCSV(e, "after")}
                className="hidden"
              />
            </label>
            <button
              onClick={handleRefreshAfter}
              className="p-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-md text-slate-400 transition-colors"
              title="Clear After Data"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Delta F (Hz) Metric Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex justify-between items-center">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block">
              Delta F
            </span>
            <span className="text-lg font-extrabold text-sky-600 font-mono">
              {deltaF !== null
                ? `${Math.round(deltaF).toLocaleString()} Hz`
                : "-- Hz"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResonanceMetrics;
