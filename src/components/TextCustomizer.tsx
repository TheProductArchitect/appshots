"use client";

import React from "react";
import { Screenshot } from "../lib/types";

interface TextCustomizerProps {
  screenshots: Screenshot[];
  activePreviewIndex: number;
  onTextChange: (id: string, field: "headline" | "subtitle" | "bgType" | "bgColor1" | "bgColor2" | "textColor", value: string) => void;
  onSetActive: (index: number) => void;
}

export function TextCustomizer({ screenshots, activePreviewIndex, onTextChange, onSetActive }: TextCustomizerProps) {
  if (screenshots.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-bold lowercase tracking-wide">customize screen</h3>
        <p className="text-sm text-gray-500 lowercase">upload screenshots to customize.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold lowercase tracking-wide">customize screen</h3>
      
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {screenshots.map((shot, index) => (
          <div 
            key={shot.id} 
            className={`p-4 rounded-2xl border-2 transition-colors cursor-pointer ${index === activePreviewIndex ? "border-blue bg-blue/5" : "border-gray-100 hover:border-gray-200"}`}
            onClick={() => onSetActive(index)}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={shot.url} alt="" className="w-10 h-16 object-cover rounded bg-gray-200 border" />
              <span className="text-xs font-bold text-gray-400 lowercase">screen {index + 1}</span>
            </div>

            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
              {/* Text Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 lowercase">headline</label>
                  <input
                    type="text"
                    value={shot.headline}
                    onChange={(e) => onTextChange(shot.id, "headline", e.target.value)}
                    placeholder="manage your tasks."
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue transition-colors bg-white shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 lowercase">subtitle</label>
                  <input
                    type="text"
                    value={shot.subtitle}
                    onChange={(e) => onTextChange(shot.id, "subtitle", e.target.value)}
                    placeholder="the best app for productivity"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue transition-colors bg-white shadow-sm"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Background Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <label className="block text-xs font-semibold text-gray-500 lowercase">background style</label>
                   <div className="flex gap-2 text-xs">
                     <button 
                       onClick={() => onTextChange(shot.id, "bgType", "solid")}
                       className={`px-2 py-1 rounded ${shot.bgType === "solid" ? "bg-charcoal text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                     >
                       solid
                     </button>
                     <button 
                       onClick={() => onTextChange(shot.id, "bgType", "gradient")}
                       className={`px-2 py-1 rounded ${shot.bgType === "gradient" ? "bg-charcoal text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                     >
                       gradient
                     </button>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="color" 
                      value={shot.bgColor1} 
                      onChange={(e) => onTextChange(shot.id, "bgColor1", e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer p-0 border-0"
                    />
                    <span className="text-xs text-gray-500 lowercase">color 1</span>
                  </div>
                  
                  {shot.bgType === "gradient" && (
                    <div className="flex-1 flex items-center gap-2">
                      <input 
                        type="color" 
                        value={shot.bgColor2} 
                        onChange={(e) => onTextChange(shot.id, "bgColor2", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer p-0 border-0"
                      />
                      <span className="text-xs text-gray-500 lowercase">color 2</span>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Text Color Options */}
              <div className="flex items-center justify-between">
                 <label className="block text-xs font-semibold text-gray-500 lowercase">text color</label>
                 <div className="flex gap-2 text-xs">
                   <button 
                     onClick={() => onTextChange(shot.id, "textColor", "dark")}
                     className={`px-2 py-1 rounded ${shot.textColor === "dark" ? "bg-charcoal text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                   >
                     dark
                   </button>
                   <button 
                     onClick={() => onTextChange(shot.id, "textColor", "light")}
                     className={`px-2 py-1 rounded ${shot.textColor === "light" ? "bg-charcoal text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                   >
                     light
                   </button>
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
