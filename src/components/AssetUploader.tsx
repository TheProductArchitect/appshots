"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ImageIcon, X } from "lucide-react";
import { Screenshot } from "../lib/types";

interface AssetUploaderProps {
  assets: { screenshots: Screenshot[]; logo: string | null };
  onAssetsChange: (assets: { screenshots: Screenshot[]; logo: string | null }) => void;
}

export function AssetUploader({ assets, onAssetsChange }: AssetUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newScreenshots: Screenshot[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        headline: "",
        subtitle: "",
        bgType: "solid",
        bgColor1: "#f8fafc",
        bgColor2: "#e2e8f0",
        bgImage: null,
        textColor: "dark",
        screenshotOffsetY: 50,
        screenshotZoom: 100,
      }));

      onAssetsChange({ 
        logo: assets.logo, 
        screenshots: [...assets.screenshots, ...newScreenshots] 
      });
    },
    [assets, onAssetsChange]
  );

  const onLogoDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const newLogo = URL.createObjectURL(acceptedFiles[0]);
        onAssetsChange({ ...assets, logo: newLogo });
      }
    },
    [assets, onAssetsChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });
  const { 
    getRootProps: getLogoRootProps, 
    getInputProps: getLogoInputProps, 
    isDragActive: isLogoDragActive 
  } = useDropzone({ onDrop: onLogoDrop, maxFiles: 1, accept: { 'image/*': [] } });

  const removeScreenshot = (id: string) => {
    onAssetsChange({
      ...assets,
      screenshots: assets.screenshots.filter(s => s.id !== id)
    });
  };

  const removeLogo = () => {
    onAssetsChange({ ...assets, logo: null });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-bold lowercase tracking-wide">upload logo</h3>
        {assets.logo ? (
          <div className="relative inline-block border rounded-2xl p-2 bg-gray-light shadow-sm">
             <img src={assets.logo} alt="Logo" className="w-24 h-24 object-contain rounded-xl bg-white" />
             <button onClick={removeLogo} className="absolute -top-2 -right-2 bg-charcoal text-white rounded-full p-1 hover:bg-blue transition-colors">
                <X size={16} />
             </button>
          </div>
        ) : (
          <div
            {...getLogoRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
              ${isLogoDragActive ? "border-blue bg-blue/5" : "border-gray-300 hover:border-gray-400 bg-gray-light/50"}`}
          >
            <input {...getLogoInputProps()} />
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">drag & drop master logo</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
         <h3 className="text-sm font-bold lowercase tracking-wide">upload screenshots</h3>
         <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
              ${isDragActive ? "border-blue bg-blue/5" : "border-gray-300 hover:border-gray-400 bg-gray-light/50"}`}
          >
            <input {...getInputProps()} />
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">drag & drop app screenshots (batch upload)</p>
          </div>

          {assets.screenshots.length > 0 && (
             <div className="grid grid-cols-4 gap-4 mt-4">
               {assets.screenshots.map((shot) => (
                 <div key={shot.id} className="relative group rounded-2xl overflow-hidden border shadow-sm bg-gray-light">
                   <img src={shot.url} alt={`Screenshot ${shot.id}`} className="w-full h-32 object-cover" />
                   <button 
                      onClick={() => removeScreenshot(shot.id)} 
                      className="absolute top-2 right-2 bg-charcoal/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue"
                    >
                      <X size={14} />
                   </button>
                 </div>
               ))}
             </div>
          )}
      </div>
    </div>
  );
}
