"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { CategoryFilter } from "@/components/map/CategoryFilter";
import { PostCard } from "@/components/feed/PostCard";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { matchCategory } from "@/lib/seedData";
import {
  Compass,
  Sparkles,
  PlusCircle,
  Award,
  Star,
  MapPin,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  ChevronRight,
  Heart,
  Edit3,
  Search,
  Users,
} from "lucide-react";

export default function HomePage() {
  const { currentUser, locationName, isLoading, toggleAccountStatus } = useAuth();
  const { posts, chats, reviews, getFilteredExperts, getRecentChatUsers } = useData();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<"MY_POSTS" | "ALL_POSTS">("MY_POSTS");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Search Map handler: validate experts in DB first, then navigate
  const handleSearchMap = () => {
    const query = searchQuery.trim();

    // Always require a search query before going to the map
    if (!query) {
      setSearchError("Masukkan kata kunci keahlian atau nama ahli IT terlebih dahulu sebelum mencari di peta.");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    // Search the expert database synchronously (data already loaded via Convex reactive query)
    const matchedExperts = getFilteredExperts({
      searchQuery: query,
      sortBy: "rating",
    });

    setIsSearching(false);

    if (matchedExperts.length === 0) {
      setSearchError(`Tidak ada ahli IT ditemukan untuk "${query}". Coba kata kunci lain seperti nama, keahlian, atau bidang spesialisasi.`);
      return;
    }

    // Experts found → navigate to map with pre-filled query
    const params = new URLSearchParams({ q: query });
    router.push(`/find?${params.toString()}`);
  };

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading FTE Dashboard...</p>
        </div>
      </div>
    );
  }

  // Filtered posts for search and category
  const filteredCommunityPosts = posts.filter((p) => {
    const matchCat = matchCategory(p.kategori, selectedCategory);
    const matchSearch =
      !searchQuery.trim() ||
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const myPosts = posts.filter((p) => p.ahli_id === currentUser.id);
  const expertReviews = reviews.filter((r) => r.ahli_id === currentUser.id);
  const myTotalLikes = myPosts.reduce((acc, p) => acc + (p.likes || 0), 0);

  const nearbyExperts = getFilteredExperts({
    maxDistanceKm: 45,
    searchQuery,
    category: selectedCategory,
    sortBy: "rating",
  }).slice(0, 4);

  const recentChatThreads = getRecentChatUsers();
  const unreadMessagesCount = chats.filter(
    (c) => c.penerima_id === currentUser.id && !c.dibaca
  ).length;

  // =========================================================================
  // VIEW: EXPERT WORKSPACE (AHLI)
  // =========================================================================
  if (currentUser.role === "AHLI") {
    return (
      <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
        {/* Deactivated Notice Banner */}
        {currentUser.is_active === false && (
          <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="space-y-0.5">
              <p className="font-extrabold text-rose-700 dark:text-rose-300">
                Akun Anda Saat Ini Dinonaktifkan
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                Postingan dan profil Anda tidak muncul di Community Feed publik sampai Anda mengaktifkannya kembali.
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleAccountStatus(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition shrink-0 cursor-pointer"
            >
              Aktifkan Akun Sekarang
            </button>
          </div>
        )}

        {/* Expert Workspace Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-10 shadow-2xl shadow-emerald-950/30 border border-emerald-700/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified Expert Mentor
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    currentUser.is_active !== false
                      ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/40"
                      : "bg-rose-400/20 text-rose-200 border-rose-400/40"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentUser.is_active !== false ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                    }`}
                  />
                  {currentUser.is_active !== false ? "Akun: Aktif (Di Feed)" : "Akun: Nonaktif (Disembunyikan)"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    isAvailable
                      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-400/30"
                      : "bg-amber-400/20 text-amber-200 border border-amber-400/40 hover:bg-amber-400/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  {isAvailable ? "Konsultasi: Menerima Klien" : "Konsultasi: Sedang Sibuk"}
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Expert Workspace: <span className="text-emerald-300">{currentUser.name}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-emerald-100/80 text-xs sm:text-sm leading-relaxed pt-1">
                <span>Specialization:</span>
                <div className="inline-flex flex-wrap gap-1">
                  {(currentUser.kategori_keahlian || "General")
                    .split(",")
                    .map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-white font-bold text-xs border border-emerald-400/30"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                </div>
                <span>• Service Base: <strong className="text-white">{currentUser.lokasi_nama || locationName}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsCreatePostOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition hover:scale-105 flex items-center justify-center gap-2 cursor-pointer btn-press"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                Upload Work from Gallery
              </button>
              <Link
                href="/messages"
                className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/20 transition flex items-center justify-center gap-2 btn-press"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                Inquiries {unreadMessagesCount > 0 && `(${unreadMessagesCount} New)`}
              </Link>
              <Link
                href="/profile/edit"
                className="px-5 py-2 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition flex items-center justify-center gap-2 btn-press"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Manage Portfolio & Bio
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Interactive KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5 card-hover animate-fadeIn stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {myPosts.length}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">My Portfolio</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5 card-hover animate-fadeIn stagger-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {myTotalLikes}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Total Likes</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5 card-hover animate-fadeIn stagger-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentUser.rata_rata_rating?.toFixed(1) || "5.0"}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {expertReviews.length} Client Reviews
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5 card-hover animate-fadeIn stagger-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {unreadMessagesCount}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">New Messages</p>
            </div>
          </div>
        </section>

        {/* Recent Inquiries from Clients */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recent Consultation Inquiries
                </h3>
                <p className="text-xs text-slate-500">
                  Direct requests from clients seeking your professional guidance
                </p>
              </div>
            </div>
            <Link
              href="/messages"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Open Inbox <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentChatThreads.length > 0 ? (
              recentChatThreads.slice(0, 3).map((thread) => (
                <div
                  key={thread.user.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2.5 rounded-2xl transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        thread.user.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.user.name}`
                      }
                      alt={thread.user.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {thread.user.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">{thread.lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {thread.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
                        {thread.unreadCount} new
                      </span>
                    )}
                    <Link
                      href={`/messages?to=${thread.user.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm btn-press"
                    >
                      Reply
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No recent consultation inquiries yet. Clients will reach out once they discover your portfolio.
              </div>
            )}
          </div>
        </section>

        {/* Portfolio & Posts Tabs (CRUD Focus) */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("MY_POSTS")}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "MY_POSTS"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Manage My Portfolio ({myPosts.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ALL_POSTS")}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "ALL_POSTS"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Community Feed ({posts.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatePostOpen(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer btn-press"
            >
              <PlusCircle className="w-4 h-4" />
              + Publish New Case Study
            </button>
          </div>

          {activeTab === "MY_POSTS" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Click the three dots on any card to <strong>Edit</strong> or <strong>Delete</strong> your work.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myPosts.length > 0 ? (
                  myPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="col-span-full py-14 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      You haven't published any portfolio case studies yet
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Upload photos of your work, research findings, or project documentation from your device gallery to attract clients.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreatePostOpen(true)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-500/20 transition inline-flex items-center gap-1.5 cursor-pointer btn-press"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Upload First Project & Case Study
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCommunityPosts.length > 0 ? (
                  filteredCommunityPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    No community posts found for this category.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: CLIENT DISCOVERY DASHBOARD (USER_BIASA)
  // =========================================================================
  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Discovery Hero: Balanced 2-Column Layout */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-emerald-800 text-white p-6 sm:p-10 shadow-xl shadow-blue-900/20 border border-blue-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Search & CTA */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Welcome back, {currentUser.name.split(" ")[0]}! 👋</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Discover Proven Mentors & Solutions in{" "}
              <span className="text-amber-300 font-black block sm:inline">
                {locationName}
              </span>
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              Consult software architecture, web/mobile development, AI models, cybersecurity, or cloud infrastructure directly with verified IT experts across North Sulawesi without intermediaries.
            </p>

            {/* Quick Search Bar */}
            <div className="pt-1 max-w-xl space-y-1.5">
              <div className={`flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-xl transition-all ${
                searchError
                  ? "border-2 border-red-400/80"
                  : "border border-white/20"
              }`}>
                <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchMap();
                  }}
                  placeholder="Search expertise, mentor name, or keywords..."
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none px-2"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setSearchError(""); }}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
                  >
                    ×
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSearchMap}
                  disabled={isSearching}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-sm transition shrink-0 btn-press flex items-center gap-1.5"
                >
                  {isSearching ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-3 h-3" />
                  )}
                  Search Map
                </button>
              </div>
              {searchError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-xl text-xs text-red-100 animate-fadeIn">
                  <span>⚠️</span>
                  <span>{searchError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/find"
                className="px-5 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs shadow-lg shadow-black/10 transition hover:scale-105 flex items-center gap-2 btn-press"
              >
                <Compass className="w-4 h-4 text-blue-600" /> Explore Interactive Map
              </Link>
              <Link
                href="/messages"
                className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/25 transition flex items-center gap-2 btn-press"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" /> My Consultation Messages
              </Link>
            </div>
          </div>

          {/* Right Column: Quick Category Discovery Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Popular IT Fields in North Sulawesi
                  </span>
                </div>
                <span className="text-[11px] text-blue-200 font-medium">Tap to filter</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Technology & Software", icon: "💻" },
                  { name: "Mobile App Development", icon: "📱" },
                  { name: "UI/UX & Product Design", icon: "🎨" },
                  { name: "Data Science & AI", icon: "🤖" },
                  { name: "Cybersecurity & Network", icon: "🛡️" },
                  { name: "Cloud & DevOps", icon: "☁️" },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedCategory(item.name)}
                    className={`text-left p-2.5 rounded-xl transition text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                      selectedCategory === item.name
                        ? "bg-white text-blue-700 shadow-md font-bold"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.name.split("&")[0]}</span>
                  </button>
                ))}
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-blue-100/80">
                <span>🛡️ Verified Mentors</span>
                <span>⚡ Zero Intermediary Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Value Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">GPS Proximity Filter</h4>
            <p className="text-[11px] text-slate-500">Accurate distance radius from your location in North Sulawesi</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Verified Portfolios</h4>
            <p className="text-[11px] text-slate-500">Review authentic case studies and project documentation before chatting</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Direct Mentoring</h4>
            <p className="text-[11px] text-slate-500">Instant real-time messaging and seamless collaboration</p>
          </div>
        </div>
      </section>

      {/* Recommended Nearby Experts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Recommended Local Mentors Near You
              </h2>
              <p className="text-xs text-slate-500">
                Verified specialists in {locationName} and neighboring regencies
              </p>
            </div>
          </div>
          <Link
            href="/find"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All on Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nearbyExperts.length > 0 ? (
            nearbyExperts.map((expert, idx) => (
              <div
                key={expert.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between group card-hover animate-fadeIn stagger-${(idx % 4) + 1}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={
                          expert.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`
                        }
                        alt={expert.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-500 transition"
                      />
                      {expert.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                        {expert.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        {(expert.kategori_keahlian || "Expert")
                          .split(",")
                          .slice(0, 2)
                          .map((cat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md"
                            >
                              <Award className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[130px]">{cat.trim()}</span>
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    {expert.deskripsi_bio || "Experienced practitioner mentor in North Sulawesi."}
                  </p>

                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {expert.rata_rata_rating?.toFixed(1) || "5.0"}
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3" />
                      {expert.distanceKm} km ({expert.travelTimeMin} min)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    href={`/messages?to=${expert.id}`}
                    className="py-2 text-center bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm btn-press"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </Link>
                  <Link
                    href={`/experts/${expert.id}`}
                    className="py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1 btn-press"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
              <p className="text-xs text-slate-500">
                No mentors found matching your search in this area.
              </p>
              <Link
                href="/find"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" /> Explore all regions on the interactive map →
              </Link>
            </div>
          )}

          {/* Complementary helper card if only 1-2 experts */}
          {nearbyExperts.length > 0 && nearbyExperts.length < 4 && (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white dark:from-slate-800/60 dark:to-slate-900 rounded-3xl p-5 border border-dashed border-blue-200 dark:border-slate-700 flex flex-col justify-between text-center space-y-3">
              <div className="space-y-2 pt-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Expand Search Radius
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  Discover verified practitioners in Tomohon, Bitung, Minahasa, and beyond.
                </p>
              </div>
              <Link
                href="/find"
                className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-blue-50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 rounded-xl text-xs font-bold transition shadow-sm btn-press"
              >
                Open Regional Map
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feed & Case Studies */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Practitioner Case Studies & Publications
            </h2>
            <p className="text-xs text-slate-500">
              Tangible works, research findings, and practical tips published by verified experts
            </p>
          </div>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredCommunityPosts.length > 0 ? (
            filteredCommunityPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
              <p className="text-sm font-semibold text-slate-500">
                No publications found for category "{selectedCategory}".
              </p>
              <p className="text-xs text-slate-400">
                Select another category or check back soon for case study updates from our specialists.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
