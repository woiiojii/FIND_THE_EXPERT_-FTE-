"use client";

import React from "react";
import { Radar } from "lucide-react";

interface RadiusSliderProps {
  radiusKm: number;
  onChange: (val: number) => void;
  expertsCount: number;
}

const PRESET_DISTANCES = [5, 10, 20, 35, 50];

export const RadiusSlider: React.FC<RadiusSliderProps> = ({
  radiusKm,
  onChange,
  expertsCount,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Radar className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Search Distance Radius
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Found <span className="font-bold text-blue-600 dark:text-blue-400">{expertsCount} mentors</span> within range
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
          {radiusKm} km
        </div>
      </div>

      <div className="py-2">
        <input
          type="range"
          min="1"
          max="60"
          step="1"
          value={radiusKm}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        {PRESET_DISTANCES.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              radiusKm === preset
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {preset} km
          </button>
        ))}
      </div>
    </div>
  );
};
