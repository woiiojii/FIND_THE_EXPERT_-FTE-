"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { CategoryFilter } from "@/components/map/CategoryFilter";
import { RadiusSlider } from "@/components/map/RadiusSlider";
import { ExpertMap } from "@/components/map/ExpertMap";
import { ExpertCard } from "@/components/expert/ExpertCard";
import { ExpertWithDistance } from "@/types";
import {
  Compass,
  Search,
  List,
  Map as MapIcon,
  Award,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function FindExpertPage() {
  const { currentUser, userLocation, locationName } = useAuth();
  const { getFilteredExperts } = useData();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [radiusKm, setRadiusKm] = useState<number>(35);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "reviews">("distance");
  const [viewMode, setViewMode] = useState<"both" | "map" | "list">("both");
  const [selectedExpert, setSelectedExpert] = useState<ExpertWithDistance | null>(null);

  // Compute filtered experts
  const filteredExperts = getFilteredExperts({
    category: selectedCategory,
    maxDistanceKm: radiusKm,
    searchQuery,
    sortBy,
  });

  // Dedicated notice if an expert lands on /find
  if (currentUser?.role === "AHLI") {
    return (
      <div className="py-20 text-center space-y-4 max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Expert Mentor Mode
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          As a registered Expert Mentor, you manage incoming client consultations, share case study articles, and connect with seekers directly from your dedicated workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Link
            href="/home"
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <span>Go to Expert Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/profile/edit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            Edit My Bio & Skills
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Compass className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Find Local Experts & Mentors
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Reference center from <span className="font-semibold text-blue-600 dark:text-blue-400">{locationName}</span> with dynamic GPS radius.
            </p>
          </div>

          {/* Controls: Search Keyword & View Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, names, topics..."
                className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="distance">📍 Nearest Distance</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="reviews">💬 Most Reviewed</option>
            </select>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode("both")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition hidden lg:block cursor-pointer ${
                  viewMode === "both"
                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === "map"
                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List ({filteredExperts.length})
              </button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Main Grid: Controls + Map + List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Radius Slider & Controls */}
        <div className="lg:col-span-4 space-y-4">
          <RadiusSlider
            radiusKm={radiusKm}
            onChange={setRadiusKm}
            expertsCount={filteredExperts.length}
          />

          {/* Quick List for split view or list view */}
          {(viewMode === "both" || viewMode === "list") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Discovered Mentors ({filteredExperts.length})
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Max. {radiusKm} km
                </span>
              </div>

              {filteredExperts.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {filteredExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 mb-2">
                    No experts found within {radiusKm} km radius.
                  </p>
                  <button
                    onClick={() => setRadiusKm(50)}
                    className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Expand Radius to 50 km
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Map */}
        {(viewMode === "both" || viewMode === "map") && (
          <div className={viewMode === "map" ? "lg:col-span-12" : "lg:col-span-8"}>
            <div className="sticky top-20 h-[560px] sm:h-[640px] w-full">
              <ExpertMap
                userLocation={userLocation}
                locationName={locationName}
                experts={filteredExperts}
                radiusKm={radiusKm}
                selectedExpertId={selectedExpert?.id}
                onSelectExpert={setSelectedExpert}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
