"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  Sparkles,
  MapPin,
  MessageSquare,
  Award,
  Star,
  ChevronRight,
  ArrowRight,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    title: "Discover Nearby Experts",
    desc: "Interactive GPS map to locate verified practitioners and mentors across North Sulawesi.",
  },
  {
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    title: "Direct Consultation",
    desc: "Fast, real-time 1-on-1 chat without intermediaries or platform commission barriers.",
  },
  {
    icon: Award,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    title: "Verified Portfolios",
    desc: "Practitioners prove their competence through authentic case studies and project galleries.",
  },
  {
    icon: Star,
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    title: "Honest Ratings & Reviews",
    desc: "Find top-rated mentors backed by transparent feedback from real community clients.",
  },
];

const AREAS = [
  { name: "Manado", desc: "Technology & Professional Services", emoji: "🏙️" },
  { name: "Tomohon", desc: "Agrotechnology & Horticulture", emoji: "🌺" },
  { name: "Bitung", desc: "Maritime Logistics & Fisheries", emoji: "⚓" },
  { name: "Minahasa", desc: "Agrotech & Cultural Heritage", emoji: "🌾" },
  { name: "Kotamobagu", desc: "Business & MSME Incubation", emoji: "🏪" },
  { name: "Sangihe", desc: "Marine Tourism & Coastal Economy", emoji: "🏝️" },
];

export default function LandingPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  // If already authenticated, redirect to home/dashboard
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/home");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (currentUser) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* ========== NAVBAR SIMPLE ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              Find The Expert
            </span>
            <p className="text-[10px] text-emerald-600 font-bold -mt-0.5">North Sulawesi</p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
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
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/60 dark:to-emerald-950/60 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            North Sulawesi Mentoring & Expert Consultation Platform
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            Find the{" "}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500">
                Best Experts
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10 Q75 2 150 8 Q225 14 298 6" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" fill="none" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {" "}Around You
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Connect directly with proven specialists — from software engineering and agrotechnology to logistics and corporate legal consulting in North Sulawesi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/register"
              id="get-started-btn"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-2xl shadow-blue-500/30 transition hover:scale-105 hover:shadow-blue-500/40"
            >
              <Zap className="w-5 h-5" />
              Get Started — Free Registration
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition hover:scale-105"
            >
              Already have an account? Sign In
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-center">
            {[
              { value: "2 Roles", label: "Experts & Clients" },
              { value: "6 Regions", label: "North Sulawesi Coverage" },
              { value: "9+ Fields", label: "Domain Specializations" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
          <span className="text-[10px] font-medium">Scroll down</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-slate-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Key Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              A powerful, clean platform connecting North Sulawesi businesses, learners, and practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={`w-6 h-6 bg-gradient-to-br ${f.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5" /> How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 dark:from-blue-900 dark:via-indigo-900 dark:to-emerald-900" />

            {[
              {
                step: "01",
                color: "from-blue-600 to-indigo-600",
                shadow: "shadow-blue-500/20",
                title: "Create an Account",
                desc: "Choose your role: Client or Expert Mentor. Set your profile and select your home base in North Sulawesi.",
              },
              {
                step: "02",
                color: "from-indigo-600 to-purple-600",
                shadow: "shadow-indigo-500/20",
                title: "Discover or Showcase",
                desc: "Clients explore regional maps and project feeds. Experts publish real case studies to attract clients.",
              },
              {
                step: "03",
                color: "from-emerald-600 to-teal-600",
                shadow: "shadow-emerald-500/20",
                title: "Start Consulting",
                desc: "Initiate direct 1-on-1 chats. Build meaningful professional partnerships without intermediaries.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className={`relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-black text-2xl shadow-xl ${item.shadow} mb-5 hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COVERAGE AREAS ========== */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 via-indigo-700 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Regional Coverage
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Serving All of North Sulawesi
            </h2>
            <p className="text-blue-100/80 text-sm max-w-xl mx-auto">
              From Manado to Sangihe — vetted mentors across cities and regencies ready to collaborate with you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {AREAS.map((area) => (
              <div
                key={area.name}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-1">{area.emoji}</div>
                <p className="font-bold text-white text-sm">{area.name}</p>
                <p className="text-blue-200/70 text-[10px]">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BOTTOM ========== */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-2xl shadow-blue-500/25 mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Ready to Connect with Experts?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-8 max-w-xl mx-auto">
            Join as a Client or register as a Verified Mentor to unlock opportunities across North Sulawesi today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-2xl shadow-blue-500/30 transition hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Get Started — It's Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition hover:scale-105"
            >
              Sign In to My Account
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Find The Expert</span>
        </div>
        <p className="text-xs text-slate-400">North Sulawesi Mentoring & Expert Consultation Platform</p>
      </footer>
    </div>
  );
}
