import React from "react";
import { Database, FileJson, Download } from "lucide-react";

function SavedRunsDatabase({ analyses, handleLoadAnalysis }) {
  const handleDownloadJSON = (e, item) => {
    e.stopPropagation(); // Prevent loading the run on chart
    try {
      const data = {
        title: item.title,
        measurement_type: item.measurement_type,
        created_at: item.created_at,
        avg_frequency1: item.avg_frequency1,
        avg_frequency2: item.avg_frequency2,
        delta_f: item.delta_f,
        data: JSON.parse(item.file1_data),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        item.file1_name || `${item.title.replace(/\s+/g, "_")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download JSON error:", err);
      alert("Failed to download JSON file: " + err.message);
    }
  };

  return (
    <div className="glass-panel p-2 flex-1 flex flex-col min-h-[180px]">
      <h3 className="text-base font-bold text-slate-700 mb-1 flex items-center gap-1 border-b border-slate-100 pb-1 shrink-0">
        <Database className="w-4 h-4 text-blue-500" />
        <span>Saved Runs Database (.json)</span>
      </h3>
      {analyses.length === 0 ? (
        <p className="text-sm text-slate-400 italic">
          No saved runs in database.
        </p>
      ) : (
        <div className="overflow-y-auto flex-1 flex flex-col gap-1.5 pr-0.5 custom-scrollbar min-h-0">
          {analyses.map((item) => (
            <div
              key={item.id}
              onClick={() => handleLoadAnalysis(item)}
              className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-md p-2 cursor-pointer flex items-center transition-all group"
            >
              <FileJson className="w-5.5 h-5.5 text-slate-400 group-hover:text-sky-500 mr-2.5 shrink-0 transition-colors" />
              <div className="min-w-0 flex-1 mr-2">
                <p className="text-sm font-bold text-slate-700 truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span
                    className="text-xs text-sky-600 font-mono truncate max-w-[120px]"
                    title={item.file1_name}
                  >
                    {item.file1_name || "data.json"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleDownloadJSON(e, item)}
                  className="p-1 hover:bg-slate-200/60 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                  title="Download JSON File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-extrabold ${item.measurement_type === "measurement" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-sky-50 text-sky-600 border border-sky-100"}`}
                >
                  {item.measurement_type === "measurement"
                    ? "Measure"
                    : "Sweep"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedRunsDatabase;
