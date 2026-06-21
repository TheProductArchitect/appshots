"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ImagePlus, X } from "lucide-react";
import { Screenshot, DeviceCategory } from "../lib/types";

interface UploadSectionProps {
  screenshots: Screenshot[];
  logo: string | null;
  device: DeviceCategory;
  onScreenshotsAdd: (shots: Screenshot[]) => void;
  onLogoChange: (logo: string | null) => void;
}

const DEFAULT_BG_COLORS = ['#f0f4ff', '#fdf4ff', '#f0fdf4', '#fff7ed', '#f8fafc', '#eff6ff', '#fef2f2'];

const DEVICE_HINTS: Record<DeviceCategory, string> = {
  iphone: 'portrait screenshots (9:16)',
  android: 'portrait screenshots (9:16)',
  ipad: 'portrait screenshots (3:4)',
};

export function UploadSection({ screenshots, logo, device, onScreenshotsAdd, onLogoChange }: UploadSectionProps) {
  const onDropScreenshots = useCallback((files: File[]) => {
    const newShots: Screenshot[] = files.map((file, i) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      headline: '',
      subtitle: '',
      bgType: 'solid',
      bgColor1: DEFAULT_BG_COLORS[(screenshots.length + i) % DEFAULT_BG_COLORS.length],
      bgColor2: '#e0e7ff',
      bgImage: null,
      textColor: 'dark',
      screenshotOffsetY: 0,
      screenshotZoom: 100,
    }));
    onScreenshotsAdd(newShots);
  }, [screenshots.length, onScreenshotsAdd]);

  const onDropLogo = useCallback((files: File[]) => {
    if (files.length > 0) onLogoChange(URL.createObjectURL(files[0]));
  }, [onLogoChange]);

  const { getRootProps: ssProps, getInputProps: ssInput, isDragActive: ssDrag } =
    useDropzone({ onDrop: onDropScreenshots, accept: { 'image/*': [] }, multiple: true });

  const { getRootProps: logoProps, getInputProps: logoInput, isDragActive: logoDrag } =
    useDropzone({ onDrop: onDropLogo, accept: { 'image/*': [] }, maxFiles: 1 });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Screenshots dropzone */}
      <div
        {...ssProps()}
        className={`flex-1 min-h-[88px] flex items-center justify-center gap-3 border-2 border-dashed rounded-2xl cursor-pointer transition-all
          ${ssDrag ? 'border-gray-700 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50/40 hover:bg-gray-50'}`}
      >
        <input {...ssInput()} />
        <UploadCloud className={`w-5 h-5 flex-shrink-0 ${ssDrag ? 'text-gray-700' : 'text-gray-300'}`} />
        <div>
          <p className="text-sm font-semibold text-gray-600 lowercase">
            {screenshots.length > 0
              ? `${screenshots.length} screenshot${screenshots.length > 1 ? 's' : ''} — drop more`
              : 'drop screenshots here'}
          </p>
          <p className="text-xs text-gray-400 lowercase">{DEVICE_HINTS[device]}</p>
        </div>
      </div>

      {/* Logo dropzone */}
      <div className="sm:w-44">
        {logo ? (
          <div className="relative h-[88px] flex items-center justify-center border border-gray-100 rounded-2xl bg-gray-50 group px-3">
            <img src={logo} alt="Logo" className="max-h-14 max-w-full object-contain rounded-lg" />
            <button
              onClick={() => onLogoChange(null)}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
            <span className="absolute bottom-1 left-0 right-0 text-center text-xs text-gray-400 lowercase">logo</span>
          </div>
        ) : (
          <div
            {...logoProps()}
            className={`h-[88px] flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-2xl cursor-pointer transition-all
              ${logoDrag ? 'border-gray-700 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50/40 hover:bg-gray-50'}`}
          >
            <input {...logoInput()} />
            <ImagePlus className={`w-5 h-5 ${logoDrag ? 'text-gray-700' : 'text-gray-300'}`} />
            <p className="text-xs text-gray-400 lowercase">add logo</p>
          </div>
        )}
      </div>
    </div>
  );
}
