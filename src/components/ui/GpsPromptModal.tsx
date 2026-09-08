"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CITY_PRESETS } from "@/lib/geo";
import { MapPin, Navigation, ShieldCheck, X, Check } from "lucide-react";

export const GpsPromptModal: React.FC = () => {
  const { isLocationGranted, requestGps, setUserLocation, locationName } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showManualPicker, setShowManualPicker] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session
    const dismissed = sessionStorage.getItem("fte_gps_prompt_dismissed");
    if (!isLocationGranted && !dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isLocationGranted]);

  const handleAllowGps = async () => {
    setIsLocating(true);
    const success = await requestGps();
    setIsLocating(false);
    if (success) {
      setIsOpen(false);
    } else {
      setShowManualPicker(true);
    }
  };

  const handleSelectCity = (city: typeof CITY_PRESETS[0]) => {
    setUserLocation({ latitude: city.lat, longitude: city.lng }, city.name);
    setIsOpen(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("fte_gps_prompt_dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Izin Lokasi Presisi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Temukan ahli & mentor terdekat di sekitar Anda
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          FTE menggunakan lokasi GPS perangkat Anda untuk menghitung radius pencarian (1-50 km) dan menyajikan ahli paling relevan di lingkungan Anda.
        </p>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 mb-6 border border-slate-100 dark:border-slate-700/50">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Privasi terlindungi. Koordinat hanya digunakan untuk kalkulasi jarak radius lokal.
          </span>
        </div>

        {!showManualPicker ? (
          <div className="space-y-2.5">
            <button
              onClick={handleAllowGps}
              disabled={isLocating}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              {isLocating ? "Mendeteksi Lokasi GPS..." : "Aktifkan GPS Otomatis"}
            </button>

            <button
              onClick={() => setShowManualPicker(true)}
              className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-2xl text-sm transition"
            >
              Pilih Kota Manual
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Pilih Kota Domisili Anda:
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {CITY_PRESETS.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSelectCity(city)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-left text-xs font-medium text-slate-700 dark:text-slate-200 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{city.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
