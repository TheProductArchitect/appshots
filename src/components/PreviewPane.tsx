"use client";

import React from "react";
import { TemplateType } from "./TemplateSelector";
import { Screenshot } from "../lib/types";

interface PreviewPaneProps {
  template: TemplateType;
  logo: string | null;
  screenshot: Screenshot | null;
  id?: string;
}

export function PreviewPane({ template, logo, screenshot, id }: PreviewPaneProps) {
  const screenshotUrl = screenshot?.url || "https://placehold.co/1080x1920/f5f5f7/1d1d1b?text=Screenshot";
  const headline = screenshot?.headline || "your headline here";
  const subtitle = screenshot?.subtitle || "";
  
  // Extract background styles
  const isGradient = screenshot?.bgType === "gradient";
  const bgStyle: React.CSSProperties = {
    background: isGradient
      ? `linear-gradient(to bottom right, ${screenshot.bgColor1}, ${screenshot.bgColor2})`
      : screenshot?.bgColor1 || "#f8fafc"
  };

  const textColorClass = screenshot?.textColor === "light" ? "text-white" : "text-charcoal";
  const subtitleColorClass = screenshot?.textColor === "light" ? "text-white/80" : "text-gray-500";
  
  const renderStandardGradient = () => (
    <div id="preview-background-container" className="w-full h-full flex flex-col items-center pt-24 overflow-hidden relative" style={bgStyle}>
      <div className={`text-center px-8 z-10 w-full max-w-4xl ${textColorClass}`} id="preview-text-container">
        {logo && (
           <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-6 rounded-3xl shadow-lg object-contain bg-white" />
        )}
        <h1 id="preview-headline" className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-md">
          {headline}
        </h1>
        <p id="preview-subtitle" className={`text-xl md:text-2xl lg:text-3xl mt-6 font-medium ${subtitleColorClass} ${!subtitle ? 'hidden' : ''}`}>
          {subtitle}
        </p>
      </div>
      
      {/* Floating Device Mockup */}
      <div className="mt-16 relative z-10 rounded-[3rem] border-8 border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transform translate-y-12" 
           style={{ width: '45%', aspectRatio: '1/2', minWidth: '300px' }}>
         <img id="preview-image" src={screenshotUrl} alt="Screenshot" className="w-full h-full object-cover" />
      </div>
      
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );

  const renderCleanMockup = () => (
    <div id="preview-background-container" className="w-full h-full flex flex-col items-center pt-24 overflow-hidden" style={bgStyle}>
      <div className={`text-center px-8 w-full max-w-4xl ${textColorClass}`} id="preview-text-container">
        {logo && (
           <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-6 rounded-3xl shadow-sm object-contain" />
        )}
        <h1 id="preview-headline" className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
          {headline}
        </h1>
        <p id="preview-subtitle" className={`text-xl md:text-2xl lg:text-3xl mt-6 font-medium ${subtitleColorClass} ${!subtitle ? 'hidden' : ''}`}>
          {subtitle}
        </p>
      </div>
      
      {/* Device Mockup with simulated frame */}
      <div className="mt-16 relative rounded-[3rem] border-[14px] border-gray-200 bg-black shadow-2xl overflow-hidden transform translate-y-8 flex justify-center" 
           style={{ width: '45%', aspectRatio: '1/2', minWidth: '300px' }}>
         {/* Simulated camera notch */}
         <div className="absolute top-0 w-1/3 h-6 bg-gray-200 rounded-b-xl z-20"></div>
         <img id="preview-image" src={screenshotUrl} alt="Screenshot" className="w-full h-full object-cover z-10" />
      </div>
    </div>
  );

  return (
    <div 
      id={id} 
      className="relative w-full aspect-[9/16] sm:aspect-square md:aspect-[4/3] lg:aspect-[16/9] max-h-[70vh] bg-white overflow-hidden shadow-xl rounded-3xl"
    >
      {template === "standard-gradient" ? renderStandardGradient() : renderCleanMockup()}
    </div>
  );
}
