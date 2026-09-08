"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Coordinates, ExpertWithDistance } from "@/types";
import { MapPin, Navigation, Star, Award, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ExpertMapProps {
  userLocation: Coordinates;
  locationName: string;
  experts: ExpertWithDistance[];
  radiusKm: number;
  selectedExpertId?: string | null;
  onSelectExpert: (expert: ExpertWithDistance | null) => void;
}

// Inner dynamic Leaflet component to prevent Next.js SSR document undefined errors
const LeafletMapInner = dynamic(
  () => import("./LeafletMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] bg-slate-100 dark:bg-slate-800/60 rounded-3xl flex flex-col items-center justify-center gap-3 animate-pulse border border-slate-200 dark:border-slate-700">
        <Navigation className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Interactive Map...</p>
      </div>
    ),
  }
);

export const ExpertMap: React.FC<ExpertMapProps> = (props) => {
  return (
    <div className="relative w-full h-full min-h-[440px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-lg">
      <LeafletMapInner {...props} />
    </div>
  );
};
