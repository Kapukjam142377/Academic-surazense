import React from "react";
import { FileText, Folder } from "lucide-react";

function DataExportCard({
  nameEntry,
  setNameEntry,
  directoryEntry,
  handleSelectSaveDirectory,
  openBcEntry,
  handleImportBaselineCSV,
  handleSaveCSVDataAndAnalysis,
  isSaving,
  mode,
  chartData,
  freqRangeMean,
}) {
  return (
    <div className="glass-panel p-2 flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-700 mb-0.5 flex items-center gap-1">
        <FileText className="w-4 h-4 text-slate-500" />
        Save File
      </h3>

      {/* File details input forms */}
      <div className="flex flex-col gap-1.5">
        <div>
          <span className="text-sm uppercase font-bold text-slate-400 block mb-0.5">
            Session Run Name
          </span>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-base focus:outline-none focus:border-sky-500 font-semibold text-slate-700"
            value={nameEntry}
            onChange={(e) => setNameEntry(e.target.value)}
            placeholder="e.g. egfr_run_01"
          />
        </div>
        <div>
          <span className="text-sm uppercase font-bold text-slate-400 block mb-0.5">
            Save Directory
          </span>
          <div className="flex gap-1.5">
            <input
              type="text"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-sm text-slate-400 focus:outline-none truncate font-mono"
              value={directoryEntry}
              readOnly
            />
            <button
              onClick={handleSelectSaveDirectory}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md p-1.5 transition-colors"
              title="Select Save Directory"
            >
              <Folder className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
        <div>
          <span className="text-sm uppercase font-bold text-slate-400 block mb-0.5">
            Import Baseline CSV
          </span>
          <div className="flex gap-1.5">
            <input
              type="text"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-sm text-slate-400 focus:outline-none truncate font-mono"
              value={openBcEntry || "No file imported"}
              readOnly
            />
            <label
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md p-1.5 transition-colors cursor-pointer flex items-center justify-center"
              title="Import Baseline CSV File"
            >
              <Folder className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="file"
                accept=".csv"
                onChange={handleImportBaselineCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save CSV File actions */}
      <button
        className="btn btn-warning w-full !py-1.5 text-sm font-bold mt-1"
        onClick={handleSaveCSVDataAndAnalysis}
        disabled={
          isSaving ||
          (mode === "calibration" && chartData.length === 0) ||
          (mode === "measurement" && freqRangeMean.length === 0)
        }
      >
        {isSaving ? "Saving..." : "Save CSV Data"}
      </button>
    </div>
  );
}

export default DataExportCard;
