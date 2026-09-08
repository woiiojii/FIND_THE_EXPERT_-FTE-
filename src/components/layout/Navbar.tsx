"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CITY_PRESETS } from "@/lib/geo";
import {
  Compass,
  MapPin,
  Search,
  Moon,
  Sun,
  Award,
  User as UserIcon,
  ChevronDown,
  LogOut,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, locationName, setUserLocation, logout } = useAuth();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
      setIsDark(!isDark);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400">
                Find The Expert
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 -mt-1 tracking-wider uppercase flex items-center gap-1">
                📍 North Sulawesi
              </span>
            </div>
          </Link>

          {/* Location Badge & Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition cursor-pointer shadow-sm"
              title="Select region in North Sulawesi"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="max-w-[210px] xl:max-w-[260px] truncate">{locationName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-fadeIn">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  North Sulawesi Regions (GPS)
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {CITY_PRESETS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setUserLocation({ latitude: c.lat, longitude: c.lng }, c.name);
                        setIsCityDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="font-medium">{c.name}</span>
                      {locationName === c.name && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links (Role Specific) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
          {currentUser?.role === "AHLI" ? (
            <>
              <Link
                href="/home"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/home"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Expert Workspace
              </Link>
              <Link
                href="/messages"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/messages"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Consultations
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/home"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/home"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/find"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/find"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Find Experts
              </Link>
              <Link
                href="/messages"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/messages"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Messages
              </Link>
            </>
          )}
        </nav>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Find Button for Clients only */}
          {currentUser?.role !== "AHLI" && (
            <Link
              href="/find"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition lg:hidden"
              title="Search Map"
            >
              <Search className="w-5 h-5" />
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
              >
                <img
                  src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + currentUser.name}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    {currentUser.role === "AHLI" ? "Expert" : "Client"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800/60">
                      {currentUser.role === "AHLI" ? "⭐ Verified Expert Mentor" : "👤 Knowledge Seeker / Client"}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    <UserIcon className="w-4 h-4 text-blue-500" />
                    View My Profile
                  </Link>

                  {currentUser.role === "AHLI" && (
                    <Link
                      href="/profile/edit"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <Award className="w-4 h-4 text-emerald-500" />
                      Manage Portfolio & Bio
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
