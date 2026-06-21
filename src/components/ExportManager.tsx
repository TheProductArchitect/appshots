"use client";

import React, { useState } from "react";
import { DownloadCloud, Loader2 } from "lucide-react";
import { exportSingleCategory } from "../lib/exportUtils";
import { Screenshot } from "../lib/types";

interface ExportManagerProps {
  previewElementId?: string;
  screenshots: Screenshot[];
  selectedDimensions: string[];
}

export function ExportManager({ previewElementId, screenshots, selectedDimensions }: ExportManagerProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (screenshots.length === 0) {
      alert("Please upload at least one screenshot to export.");
      return;
    }
    if (selectedDimensions.length === 0) {
      alert("Please select at least one export category.");
      return;
    }

    setIsExporting(true);
    try {
      await exportSingleCategory(screenshots, null, "iphone", selectedDimensions);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export assets. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl active:scale-95
          ${isExporting ? "bg-blue/70 cursor-not-allowed" : "bg-blue hover:bg-blue/90"}`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="lowercase">generating creatives...</span>
          </>
        ) : (
          <>
            <DownloadCloud className="w-6 h-6" />
            <span className="lowercase">download all creatives</span>
          </>
        )}
      </button>
    </div>
  );
}
