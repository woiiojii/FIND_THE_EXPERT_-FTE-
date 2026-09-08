"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { GpsPromptModal } from "../ui/GpsPromptModal";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  // Jangan tampilkan bar atas (Navbar) dan bar bawah (BottomNav) di halaman login/register dan landing page
  const isAuthPage = pathname.startsWith("/auth");
  const isLandingPage = pathname === "/";

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 transition-colors duration-200">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <BottomNav />
      <GpsPromptModal />
    </div>
  );
};
