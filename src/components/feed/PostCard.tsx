"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Postingan } from "@/types";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { DeleteConfirmModal } from "@/components/common/DeleteConfirmModal";
import {
  Heart,
  MessageSquare,
  Share2,
  Award,
  ShieldCheck,
  Clock,
  ExternalLink,
  Check,
  MoreVertical,
  Edit3,
  Trash2,
  UserCheck,
  Calendar,
  X,
  ZoomIn,
} from "lucide-react";

interface PostCardProps {
  post: Postingan;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { likePost, deletePost, getExpertById } = useData();
  const { currentUser } = useAuth();

  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const author = getExpertById(post.ahli_id);
  const isOwner = currentUser?.id === post.ahli_id;

  // Handle ESC key to close image lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isImageLightboxOpen) {
        setIsImageLightboxOpen(false);
      }
    };
    if (isImageLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isImageLightboxOpen]);

  const handleLike = () => {
    if (!hasLiked) {
      likePost(post.id);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        window.location.origin + `/experts/${post.ahli_id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  const timeAgo = (timestamp: number) => {
    const diffHours = Math.round((Date.now() - timestamp) / (1000 * 60 * 60));
    if (diffHours < 1) return "Baru saja";
    if (diffHours < 24) return `${diffHours}j lalu`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}h lalu`;
  };

  const formatAchievementDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden card-hover hover:border-blue-200 dark:hover:border-slate-700 relative group animate-fadeIn flex flex-col justify-between">
        <div>
          {/* Author Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <Link
              href={`/experts/${post.ahli_id}`}
              className="flex items-center gap-3 group/author"
            >
              <div className="relative">
                <img
                  src={
                    author?.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" + post.ahli_id
                  }
                  alt={author?.name || "Ahli"}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover/author:ring-blue-500 transition"
                />
                {author?.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition">
                    {author?.name || "Mentor Ahli"}
                  </h3>
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                      <UserCheck className="w-3 h-3" />
                      Milik Anda
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {post.kategori || author?.kategori_keahlian || "Keahlian"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {timeAgo(post.created_at)}
                  </span>
                </div>
              </div>
            </Link>

            {/* Right Header Actions: Owner Menu OR Consult Button */}
            <div className="flex items-center gap-2">
              {!isOwner && (
                <Link
                  href={`/messages?to=${post.ahli_id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/60 transition flex items-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Konsultasi</span>
                </Link>
              )}

              {isOwner && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Opsi Postingan"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-30 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition text-left cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                        Edit Postingan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition text-left cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Hapus Postingan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 sm:px-5 pb-3 space-y-2">
            {/* Tanggal Pencapaian Badge */}
            {post.tanggal_pencapaian && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-xl border border-blue-200/80 dark:border-blue-800/60">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Tanggal Pencapaian: {formatAchievementDate(post.tanggal_pencapaian)}</span>
              </div>
            )}

            <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
              {post.judul}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {post.deskripsi}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Post Media (Image) - Clickable for Full View Lightbox */}
          {post.media && (
            <div
              onClick={() => setIsImageLightboxOpen(true)}
              className="relative w-full aspect-video sm:aspect-[16/9] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer group/media"
              title="Klik untuk melihat foto penuh"
            >
              <img
                src={post.media}
                alt={post.judul}
                className="w-full h-full object-cover group-hover/media:scale-105 transition duration-500"
                loading="lazy"
              />
              {/* Visual Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[1px]">
                <div className="px-3.5 py-2 rounded-2xl bg-black/70 border border-white/20 flex items-center gap-1.5 shadow-xl">
                  <ZoomIn className="w-4 h-4 text-blue-400" />
                  <span>Lihat Foto Penuh</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Post Actions Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`group/like flex items-center gap-1.5 font-semibold transition btn-press cursor-pointer ${
                hasLiked
                  ? "text-rose-600 dark:text-rose-400"
                  : "hover:text-rose-600 dark:hover:text-rose-400"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  hasLiked ? "fill-rose-500 text-rose-500 scale-125" : "group-hover/like:scale-110"
                }`}
              />
              <span>{post.likes || 0} Suka</span>
            </button>

            <Link
              href={`/experts/${post.ahli_id}`}
              className="flex items-center gap-1.5 hover:text-blue-600 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Portofolio</span>
            </Link>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            title="Salin Link Portofolio"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Bagikan</span>
              </>
            )}
          </button>
        </div>
      </article>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL (PORTAL TO BODY) */}
      {mounted &&
        isImageLightboxOpen &&
        post.media &&
        createPortal(
          <div
            onClick={() => setIsImageLightboxOpen(false)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none"
          >
            {/* Top Bar Header */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 p-3.5 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    author?.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" + post.ahli_id
                  }
                  alt={author?.name || "Ahli"}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white truncate">
                      {author?.name || "Mentor Ahli"}
                    </h4>
                    {author?.verified && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {post.judul}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {post.tanggal_pencapaian && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-xl border border-blue-800/60">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    {formatAchievementDate(post.tanggal_pencapaian)}
                  </span>
                )}
                <a
                  href={post.media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1.5"
                  title="Buka gambar di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsImageLightboxOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition cursor-pointer shadow-lg"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle Image Stage */}
            <div
              onClick={() => setIsImageLightboxOpen(false)}
              className="flex-1 flex items-center justify-center p-2 sm:p-4 my-auto min-h-0 overflow-hidden"
            >
              <img
                onClick={(e) => e.stopPropagation()}
                src={post.media}
                alt={post.judul}
                className="max-h-[68vh] sm:max-h-[72vh] max-w-[95vw] sm:max-w-4xl w-auto object-contain rounded-2xl shadow-2xl ring-1 ring-white/10 animate-scaleUp"
              />
            </div>

            {/* Bottom Floating Info Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl mx-auto text-center px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-xs text-slate-300 flex items-center justify-between gap-4 shadow-xl"
            >
              <span className="truncate font-medium text-[11px] sm:text-xs">
                {post.judul}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 hidden sm:inline">
                Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[9px]">ESC</kbd> atau klik di luar untuk menutup
              </span>
            </div>
          </div>,
          document.body
        )}

      {/* Edit Post Modal */}
      {isOwner && (
        <CreatePostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={post}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isOwner && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Hapus Postingan Ini?"
          message={`Anda akan menghapus "${post.judul}". Postingan ini akan dihapus secara permanen.`}
        />
      )}
    </>
  );
};
