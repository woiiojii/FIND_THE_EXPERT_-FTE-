"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Sparkles } from "lucide-react";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = "Photo / Image",
  helperText = "JPG, PNG, or WEBP format from your device gallery (auto-optimized)",
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlOption, setShowUrlOption] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, or WEBP).");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to maximum 1280px maintaining aspect ratio
        const maxDimension = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG at 82% quality to keep size under ~150KB
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          onChange(compressedDataUrl);
        } else {
          onChange(event.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        alert("Failed to read image file.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlOption(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlOption(!showUrlOption)}
          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {showUrlOption ? "Close URL Option" : "Use Image URL"}
        </button>
      </div>

      {showUrlOption && (
        <div className="flex gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-fadeIn">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image link (https://...)"
            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
          >
            Apply
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Preview or Dropzone */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-950/5 dark:bg-slate-900/50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 sm:h-56 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition p-3 flex flex-col justify-end">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-white/90 truncate flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Photo selected from gallery
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-medium transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition"
                  title="Remove Photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isProcessing
                ? "Processing photo..."
                : "Click to select a photo from gallery / file explorer"}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              or drag & drop a photo here
            </p>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
