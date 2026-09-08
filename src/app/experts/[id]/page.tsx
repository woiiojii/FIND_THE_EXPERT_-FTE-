"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { PostCard } from "@/components/feed/PostCard";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import { calculateDistanceKm, estimateTravelTimeMinutes } from "@/lib/geo";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { User, UserRole } from "@/types";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  MessageSquare,
  Share2,
  GraduationCap,
  CheckCircle2,
  Briefcase,
  ArrowLeft,
  Calendar,
  Check,
  FileText,
  Sparkles,
  Phone,
  Mail,
  Heart,
} from "lucide-react";

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const expertId = params.id as string;

  const { currentUser, userLocation, locationName, isLoading: isAuthLoading } = useAuth();
  const { getExpertById, getReviewsForExpert, posts, likeUserProfile } = useData();

  const [activeTab, setActiveTab] = useState<"portfolio" | "reviews" | "about">("portfolio");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(0);

  // Fast direct Convex query fallback + Instant local context cache
  const directConvexUser = useQuery(
    api.users.getUserById,
    expertId ? { id: expertId } : "skip"
  );
  const localExpert = getExpertById(expertId);

const expert: User | null = useMemo(() => {
  if (localExpert) return localExpert;

  if (
    directConvexUser &&
    typeof directConvexUser === "object" &&
    "email" in directConvexUser &&
    "name" in directConvexUser &&
    "role" in directConvexUser
  ) {
    return {
      id: directConvexUser._id,
      email: directConvexUser.email,
      name: directConvexUser.name,
      role: directConvexUser.role as UserRole,
      latitude: directConvexUser.latitude,
      longitude: directConvexUser.longitude,
      avatar:
        directConvexUser.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${directConvexUser.name}`,
      lokasi_nama: directConvexUser.lokasi_nama,
      kategori_keahlian: directConvexUser.kategori_keahlian,
      deskripsi_bio: directConvexUser.deskripsi_bio,
      rata_rata_rating: directConvexUser.rata_rata_rating,
      jumlah_review: directConvexUser.jumlah_review,
      pengalaman_tahun: directConvexUser.pengalaman_tahun,
      telepon: directConvexUser.telepon,
      verified: directConvexUser.verified,
      likes: directConvexUser.likes || 0,
      keahlian_tags: directConvexUser.keahlian_tags || [],
      pendidikan: directConvexUser.pendidikan,
      sertifikasi: directConvexUser.sertifikasi,
      created_at:
        directConvexUser.created_at || directConvexUser._creationTime,
    };
  }

  return null;
}, [localExpert, directConvexUser]);

  // Sync likes count and user's like state from localStorage
  useEffect(() => {
    if (expert) {
      setLikesCount(expert.likes || 0);
    }
  }, [expert?.likes]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fte_liked_experts_v1");
      if (stored && expertId) {
        const likedIds: string[] = JSON.parse(stored);
        if (likedIds.includes(expertId)) {
          setHasLiked(true);
        }
      }
    } catch {}
  }, [expertId]);

  const handleLikeProfile = async () => {
    if (!hasLiked && expertId) {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      try {
        await likeUserProfile(expertId);
        const stored = localStorage.getItem("fte_liked_experts_v1");
        const likedIds: string[] = stored ? JSON.parse(stored) : [];
        if (!likedIds.includes(expertId)) {
          likedIds.push(expertId);
          localStorage.setItem("fte_liked_experts_v1", JSON.stringify(likedIds));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const reviews = getReviewsForExpert(expertId);
  const expertPosts = posts.filter((p) => p.ahli_id === expertId);

  // Calculate distance & ETA instantly
  const distanceKm = expert
    ? calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        expert.latitude,
        expert.longitude
      )
    : 0;
  const travelTimeMin = estimateTravelTimeMinutes(distanceKm);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Instant Skeleton Loader while resolving initially (no blocking spinner delay)
  if (!expert) {
    if (isAuthLoading || directConvexUser === undefined) {
      return (
        <div className="space-y-6 max-w-5xl mx-auto pb-14 animate-pulse">
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-3 flex-1">
                <div className="h-7 w-52 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Expert Profile Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested mentor profile might have been updated or removed.
        </p>
        <Link
          href="/find"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Find Experts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-14">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gradient-to-bl from-blue-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Verified Badge */}
            <div className="relative">
              <img
                src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`}
                alt={expert.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-xl bg-slate-100 dark:bg-slate-800"
              />
              {expert.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-md"
                  title="Verified Expert Mentor"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Expert Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {expert.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Verified Mentor
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {(expert.kategori_keahlian || "Expert Mentor")
                  .split(",")
                  .map((cat, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {cat.trim()}
                    </span>
                  ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {expert.lokasi_nama || "North Sulawesi"}
                </span>
                {expert.telepon && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {expert.telepon}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {expert.email}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Direct Consultation, Like Profile, and Rate/Review */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Link
              href={`/messages?to=${expert.id}`}
              className="flex-1 lg:flex-initial py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition btn-press"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct Consultation</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Like Profile Button */}
              <button
                onClick={handleLikeProfile}
                className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer btn-press border ${
                  hasLiked
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border-slate-200/60 dark:border-slate-700/60"
                }`}
                title={hasLiked ? "You liked this expert" : "Like this expert's profile"}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-rose-500"
                  } transition-transform`}
                />
                <span>{hasLiked ? "Liked" : "Like"}</span>
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                  {likesCount}
                </span>
              </button>

              {/* Rate & Review Button */}
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer btn-press border border-slate-200/60 dark:border-slate-700/60"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {expert.deskripsi_bio && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              About Mentor
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {expert.deskripsi_bio}
            </p>
          </div>
        )}

        {/* Skills Tags */}
        {expert.keahlian_tags && expert.keahlian_tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {expert.keahlian_tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Metrics Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
              {expert.rata_rata_rating?.toFixed(1) || "5.0"}
            </div>
            <div className="text-[10px] font-medium text-slate-500 mt-1">
              {reviews.length} Client Reviews
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
              {likesCount} Likes
            </div>
            <div className="text-[10px] font-medium text-slate-500 mt-1">
              Community Appreciation
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
              {distanceKm} km
            </div>
            <div className="text-[10px] font-medium text-slate-500 mt-1">
              ~{travelTimeMin} min from {locationName.split(" ")[0]}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
              {expert.pengalaman_tahun || 1} Years
            </div>
            <div className="text-[10px] font-medium text-slate-500 mt-1">
              Professional Practice
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "portfolio"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Portfolio & Articles ({expertPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "reviews"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Client Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "about"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Credentials & Track Record</span>
        </button>
      </div>

      {/* Tab 1: Portfolio & Case Studies */}
      {activeTab === "portfolio" && (
        <div className="space-y-4">
          {expertPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expertPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-14 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No Portfolio Published Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                This mentor hasn&apos;t shared any public case studies or knowledge articles yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Client Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Verified Client Reviews ({reviews.length})
            </h3>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              + Write a Review
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.reviewer_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user_id}`}
                        alt={rev.reviewer_name || "Client"}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.reviewer_name || "FTE Verified Client"}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(rev.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    &ldquo;{rev.komentar}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No Reviews Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first to consult with {expert.name} and leave a verified review.
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                Write First Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Credentials & Background */}
      {activeTab === "about" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              Educational Background
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              {expert.pendidikan || "Bachelor of Science / Professional Degree in related specialization."}
            </p>
          </div>

          {/* Professional Experience */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              Professional Experience
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {expert.pengalaman_tahun || 1}+ years of proven real-world industry practice and regional consultancy.
            </p>
          </div>

          {/* Certifications & Licenses */}
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Official Certifications & Verified Competencies
            </h4>
            {expert.sertifikasi && expert.sertifikasi.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {expert.sertifikasi.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Verified practitioner in {expert.kategori_keahlian || "specialized technical fields"} in North Sulawesi.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      <ReviewModal
        expert={expert}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}
