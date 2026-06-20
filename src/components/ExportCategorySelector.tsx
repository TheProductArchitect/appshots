"use client";

import React from "react";
import { EXPORT_DIMENSIONS } from "../lib/constants";
import { DeviceCategory } from "../lib/types";

interface ExportCategorySelectorProps {
  device: DeviceCategory;
  selectedDimensions: string[];
  onChange: (selected: string[]) => void;
}

export function ExportCategorySelector({ device, selectedDimensions, onChange }: ExportCategorySelectorProps) {
  const dims = EXPORT_DIMENSIONS.filter(d => d.device === device);

  const toggle = (id: string) => {
    onChange(
      selectedDimensions.includes(id)
        ? selectedDimensions.filter(d => d !== id)
        : [...selectedDimensions, id]
    );
  };

  const toggleAll = () => {
    const ids = dims.map(d => d.id);
    const allOn = ids.every(id => selectedDimensions.includes(id));
    if (allOn) {
      onChange(selectedDimensions.filter(id => !ids.includes(id)));
    } else {
      onChange([...new Set([...selectedDimensions, ...ids])]);
    }
  };

  const allSelected = dims.every(d => selectedDimensions.includes(d.id));

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-500 lowercase">export sizes</p>
        <button onClick={toggleAll} className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors lowercase">
          {allSelected ? 'deselect all' : 'select all'}
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {dims.map(dim => (
          <label key={dim.id} className="flex items-start gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center transition-colors
              ${selectedDimensions.includes(dim.id) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'}`}>
              {selectedDimensions.includes(dim.id) && (
                <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                  <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <input type="checkbox" checked={selectedDimensions.includes(dim.id)} onChange={() => toggle(dim.id)} className="sr-only" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-700">{dim.name}</span>
                <span className="text-xs text-gray-400">{dim.width}×{dim.height}</span>
                {dim.required && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">required</span>
                )}
              </div>
              {dim.notes && (
                <p className="text-xs text-gray-400 mt-0.5">{dim.notes}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
