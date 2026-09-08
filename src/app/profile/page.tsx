"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { PostCard } from "@/components/feed/PostCard";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import {
  User as UserIcon,
  Award,
  Star,
  MapPin,
  Edit3,
  LogOut,
  ShieldCheck,
  Briefcase,
  MessageSquare,
  Sparkles,
  Phone,
  Share2,
  Check,
  PlusCircle,
  Clock,
  Compass,
  FileText,
  Calendar,
  Layers,
  Heart,
} from "lucide-react";

export default function ProfilePage() {
  const { currentUser, locationName, logout, allUsers, toggleAccountStatus } = useAuth();
  const { posts, reviews, chats, getExpertById } = useData();

  const [activeTab, setActiveTab] = useState<string>("portfolio");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentUser) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Please Sign In First
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sign in or create a new account to access and manage your profile on Find The Expert (FTE).
        </p>
        <div className="flex gap-3 justify-center pt-3">
          <Link
            href="/auth/login"
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const isExpert = currentUser.role === "AHLI";

  const handleShareProfile = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        window.location.origin + (isExpert ? `/experts/${currentUser.id}` : `/profile`)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // =========================================================================
  // VIEW: EXPERT PROFILE (Verified Mentor)
  // =========================================================================
  if (isExpert) {
    const expertPosts = posts.filter((p) => p.ahli_id === currentUser.id);
    const expertReviews = reviews.filter((r) => r.ahli_id === currentUser.id);

    return (
      <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-14">
        {/* Deactivated Notice Banner */}
        {currentUser.is_active === false && (
          <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="space-y-0.5">
              <p className="font-extrabold text-rose-700 dark:text-rose-300">
                Akun Anda Saat Ini Dinonaktifkan
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                Postingan dan profil Anda disembunyikan dari Community Feed publik sampai Anda mengaktifkannya kembali.
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleAccountStatus(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition shrink-0 cursor-pointer"
            >
              Aktifkan Akun Saya
            </button>
          </div>
        )}

        {/* Expert Hero Header */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 rounded-3xl p-6 sm:p-9 text-white shadow-xl shadow-emerald-950/25 border border-emerald-700/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={
                    currentUser.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      currentUser.name
                    )}`
                  }
                  alt={currentUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-2xl bg-slate-900"
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1.5 rounded-full ring-4 ring-slate-950 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Expert Mentor
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      currentUser.is_active !== false
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    }`}
                  >
                    {currentUser.is_active !== false ? "● Status: Aktif" : "○ Status: Nonaktif"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    {currentUser.likes || 0} Profile Likes
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-[11px] font-semibold">
                    {currentUser.pengalaman_tahun || 1}+ Years Experience
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {currentUser.name}
                </h1>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-xs sm:text-sm font-semibold text-emerald-300 flex items-center gap-1 mr-1">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    Specialization:
                  </span>
                  {(currentUser.kategori_keahlian || "Technology & Software")
                    .split(",")
                    .map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold shadow-sm"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100/70 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {currentUser.lokasi_nama || locationName}
                  </span>
                  <span>•</span>
                  <span>{currentUser.email}</span>
                  {currentUser.telepon && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {currentUser.telepon}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
              <Link
                href="/profile/edit"
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile & Photo
              </Link>
              <button
                type="button"
                onClick={handleShareProfile}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Profile</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Bio Paragraph */}
          {currentUser.deskripsi_bio && (
            <div className="mt-6 pt-5 border-t border-emerald-800/60 text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-3xl">
              <p>{currentUser.deskripsi_bio}</p>
            </div>
          )}
        </div>

        {/* 4 Expert Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400" />
              {currentUser.rata_rata_rating?.toFixed(1) || "5.0"}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
              Average Satisfaction Rating
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              {expertReviews.length}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
              Client Reviews Received
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {expertPosts.length}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
              Portfolio Works Published
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
              {currentUser.pengalaman_tahun || 1} Yrs
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
              Field Experience
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "portfolio"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Portfolio & Case Studies ({expertPosts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "reviews"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Client Reviews ({expertReviews.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "about"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Service Info
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "portfolio" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Use photos from your gallery to complete your portfolio. You can edit or delete works at any time.
              </p>
              <button
                type="button"
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                + Add Work
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expertPosts.length > 0 ? (
                expertPosts.map((p) => <PostCard key={p.id} post={p} />)
              ) : (
                <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    No Portfolio Published Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Share real project case studies along with photos from your gallery.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreatePostOpen(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Publish Work Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expertReviews.length > 0 ? (
                expertReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            r.reviewer_avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                              r.reviewer_name || "User"
                            }`
                          }
                          alt={r.reviewer_name || "Reviewer"}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {r.reviewer_name || "Consultation Client"}
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            {new Date(r.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      "{r.komentar}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  No client reviews yet. Reviews will appear once users rate your consultation sessions.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Service Summary & Expert Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Areas of Expertise:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(currentUser.kategori_keahlian || "Technology & Software")
                    .split(",")
                    .map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/60"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Experience:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentUser.pengalaman_tahun || 1} Years as Practitioner
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Location:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentUser.lokasi_nama || locationName}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">WhatsApp Contact:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentUser.telepon || "Not set"}
                </span>
              </div>
            </div>
          </div>
        )}

        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: REGULAR USER PROFILE (Expert Seeker / Learner)
  // =========================================================================
  const userList = allUsers || [];
  const myConsultedExperts = Array.from(
    new Set(
      chats
        .filter((c) => c.pengirim_id === currentUser.id || c.penerima_id === currentUser.id)
        .map((c) => (c.pengirim_id === currentUser.id ? c.penerima_id : c.pengirim_id))
    )
  )
    .map((expertId) => getExpertById(expertId) || userList.find((u) => u.id === expertId))
    .filter(Boolean);

  const reviewsGivenByMe = reviews.filter((r) => r.user_id === currentUser.id);

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-14">
      {/* Regular User Hero Header */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 rounded-3xl p-6 sm:p-9 text-white shadow-xl shadow-blue-900/25 border border-blue-600/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={
                  currentUser.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    currentUser.name
                  )}`
                }
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-400/30 shadow-2xl bg-slate-900"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full ring-4 ring-slate-950 shadow-md">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-300/30 font-extrabold text-[11px] flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5" />
                  Expert Seeker / Client
                </span>
                <span className="text-xs text-blue-200/70">Registered Member</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {currentUser.name}
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/90">{currentUser.email}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200/70 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  Location: {currentUser.lokasi_nama || locationName}
                </span>
                {currentUser.telepon && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-300" />
                      {currentUser.telepon}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              href="/profile/edit"
              className="px-5 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-lg shadow-black/10 transition flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile & Photo
            </Link>
            <Link
              href="/find"
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              Find Nearby Experts
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* 3 User Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {myConsultedExperts.length}
            </p>
            <p className="text-xs text-slate-500 font-medium">Experts Contacted</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {reviewsGivenByMe.length}
            </p>
            <p className="text-xs text-slate-500 font-medium">Reviews Given</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentUser.lokasi_nama || locationName}
            </p>
            <p className="text-xs text-slate-500 font-medium">Your GPS Location</p>
          </div>
        </div>
      </div>

      {/* User Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "portfolio"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Connected Experts ({myConsultedExperts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "reviews"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          My Reviews ({reviewsGivenByMe.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "about"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          Account Details
        </button>
      </div>

      {/* User Tab Contents */}
      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myConsultedExperts.length > 0 ? (
              myConsultedExperts.map((exp: any) => (
                <div
                  key={exp.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={
                          exp.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${exp.name}`
                        }
                        alt={exp.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {exp.name}
                        </h4>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {exp.kategori_keahlian}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {exp.deskripsi_bio || "Registered expert on Find The Expert platform."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/messages?to=${exp.id}`}
                      className="py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </Link>
                    <Link
                      href={`/experts/${exp.id}`}
                      className="py-2 text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-14 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  No Experts Contacted Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore the map to discover professionals and experts for consultations.
                </p>
                <Link
                  href="/find"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md transition inline-flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  Find Experts on Map
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsGivenByMe.length > 0 ? (
              reviewsGivenByMe.map((r) => {
                const expertTarget = getExpertById(r.ahli_id) || (allUsers || []).find((u) => u.id === r.ahli_id);
                return (
                  <div
                    key={r.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            expertTarget?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                              expertTarget?.name || "Expert"
                            }`
                          }
                          alt={expertTarget?.name || "Expert"}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            For: {expertTarget?.name || "Expert"}
                          </h5>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            {expertTarget?.kategori_keahlian || "Expert"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      "{r.komentar}"
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                You haven't given any reviews yet. After consulting, you can rate the expert's service.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "about" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-blue-600" />
            Account Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">Account Role:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                Expert Seeker / Consultation Client
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">Registered Email:</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser.email}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">Location:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentUser.lokasi_nama || locationName}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-1">Contact Number:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentUser.telepon || "Not set"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
