"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Loader2, ImageIcon } from "lucide-react";
import { Screenshot, DeviceCategory, TemplateType } from "../lib/types";
import { renderCreative, clearImageCache } from "../lib/canvasRenderer";

interface CreativeCardProps {
  screenshot: Screenshot;
  logo: string | null;
  template: TemplateType;
  device: DeviceCategory;
  index: number;
  onChange: (updates: Partial<Screenshot>) => void;
  onRemove: () => void;
}

const PREVIEW_SIZES: Record<DeviceCategory, { w: number; h: number }> = {
  iphone:  { w: 480, h: 1040 },
  android: { w: 480, h: 1040 },
  ipad:    { w: 600, h: 800 },
};

const ASPECT_RATIOS: Record<DeviceCategory, string> = {
  iphone:  '9/19.5',
  android: '9/20',
  ipad:    '3/4',
};

export function CreativeCard({ screenshot, logo, template, device, index, onChange, onRemove }: CreativeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(true);
  const renderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const scheduleRender = useCallback(() => {
    if (renderTimer.current) clearTimeout(renderTimer.current);
    renderTimer.current = setTimeout(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setRendering(true);
      try {
        await renderCreative(canvas, screenshot, logo, template, device);
      } catch {
        // silently ignore image load failures
      } finally {
        setRendering(false);
      }
    }, 200);
  }, [screenshot, logo, template, device]);

  useEffect(() => {
    scheduleRender();
    return () => { if (renderTimer.current) clearTimeout(renderTimer.current); };
  }, [scheduleRender]);

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke old blob if it was one we created
    if (screenshot.bgImage?.startsWith('blob:')) {
      clearImageCache(screenshot.bgImage);
      URL.revokeObjectURL(screenshot.bgImage);
    }
    onChange({ bgType: 'image', bgImage: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const removeBgImage = () => {
    if (screenshot.bgImage?.startsWith('blob:')) {
      clearImageCache(screenshot.bgImage);
      URL.revokeObjectURL(screenshot.bgImage);
    }
    onChange({ bgType: 'solid', bgImage: null });
  };

  const isGradient = screenshot.bgType === 'gradient';
  const isBgImage  = screenshot.bgType === 'image';
  const isLightText = screenshot.textColor === 'light';
  const { w, h } = PREVIEW_SIZES[device];

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Canvas preview */}
      <div
        className="relative bg-gray-100 overflow-hidden"
        style={{ aspectRatio: ASPECT_RATIOS[device] }}
      >
        <canvas
          ref={canvasRef}
          width={w}
          height={h}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-black/55 hover:bg-black/75 text-white rounded-full p-1 transition-colors"
          title="Remove"
        >
          <X size={13} />
        </button>
        <span className="absolute bottom-2 left-2 bg-black/45 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {index + 1}
        </span>
      </div>

      {/* Inline editor */}
      <div className="p-3 space-y-2 bg-white">
        <input
          type="text"
          value={screenshot.headline}
          onChange={e => onChange({ headline: e.target.value })}
          placeholder="headline"
          className="w-full text-sm font-semibold bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors placeholder:text-gray-300 placeholder:font-normal"
        />
        <input
          type="text"
          value={screenshot.subtitle}
          onChange={e => onChange({ subtitle: e.target.value })}
          placeholder="subtitle"
          className="w-full text-xs bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors placeholder:text-gray-300"
        />

        {/* Screenshot positioning */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-14 flex-shrink-0">position</span>
            <input
              type="range" min={0} max={100} step={1}
              value={screenshot.screenshotOffsetY}
              onChange={e => onChange({ screenshotOffsetY: Number(e.target.value) })}
              className="flex-1 h-1 accent-gray-800 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-14 flex-shrink-0">zoom</span>
            <input
              type="range" min={100} max={200} step={1}
              value={screenshot.screenshotZoom}
              onChange={e => onChange({ screenshotZoom: Number(e.target.value) })}
              className="flex-1 h-1 accent-gray-800 cursor-pointer"
            />
          </div>
        </div>

        {/* Background controls */}
        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
          {isBgImage ? (
            <button
              onClick={removeBgImage}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-gray-900 text-white"
              title="Remove background image"
            >
              <ImageIcon size={11} />
              <span>bg img</span>
              <X size={10} className="ml-0.5" />
            </button>
          ) : (
            <>
              {/* Color 1 */}
              <label className="relative cursor-pointer group" title="Background color">
                <input type="color" value={screenshot.bgColor1} onChange={e => onChange({ bgColor1: e.target.value })} className="sr-only" />
                <div className="w-6 h-6 rounded-md border border-gray-200 group-hover:border-gray-400 transition-colors" style={{ background: screenshot.bgColor1 }} />
              </label>

              {/* Gradient toggle */}
              <button
                onClick={() => onChange({ bgType: isGradient ? 'solid' : 'gradient' })}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${isGradient ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Toggle gradient"
              >
                {isGradient ? '⇢' : '—'}
              </button>

              {isGradient && (
                <label className="relative cursor-pointer group" title="Gradient end color">
                  <input type="color" value={screenshot.bgColor2} onChange={e => onChange({ bgColor2: e.target.value })} className="sr-only" />
                  <div className="w-6 h-6 rounded-md border border-gray-200 group-hover:border-gray-400 transition-colors" style={{ background: screenshot.bgColor2 }} />
                </label>
              )}
            </>
          )}

          {/* Bg image upload */}
          {!isBgImage && (
            <label className="cursor-pointer group" title="Upload background image">
              <input ref={bgInputRef} type="file" accept="image/*" className="sr-only" onChange={handleBgImageUpload} />
              <div className="flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 group-hover:border-gray-400 transition-colors bg-gray-50">
                <ImageIcon size={12} className="text-gray-400" />
              </div>
            </label>
          )}

          <div className="flex-1" />

          {/* Text color toggle */}
          <button
            onClick={() => onChange({ textColor: isLightText ? 'dark' : 'light' })}
            className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-black transition-colors ${isLightText ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title={isLightText ? 'Light text (click for dark)' : 'Dark text (click for light)'}
          >
            A
          </button>
        </div>
      </div>
    </div>
  );
}
