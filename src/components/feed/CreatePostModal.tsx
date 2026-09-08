"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Postingan } from "@/types";
import { CATEGORIES } from "@/lib/seedData";
import { ImageUploadInput } from "@/components/common/ImageUploadInput";
import { X, Sparkles, Award, Edit3, CheckCircle2, Calendar, AlertCircle } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Postingan | null;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
}) => {
  const { currentUser } = useAuth();
  const { createPost, updatePost } = useData();

  const isEditMode = Boolean(initialData);

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("Technology & Software");
  const [tanggalPencapaian, setTanggalPencapaian] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [media, setMedia] = useState("");
  const [tagsString, setTagsString] = useState("Portfolio, Mentoring");
  const [mediaError, setMediaError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (initialData) {
      setJudul(initialData.judul);
      setDeskripsi(initialData.deskripsi);
      setKategori(initialData.kategori || currentUser?.kategori_keahlian || "Technology & Software");
      setTanggalPencapaian(
        initialData.tanggal_pencapaian ||
          new Date(initialData.created_at || Date.now()).toISOString().split("T")[0]
      );
      setMedia(initialData.media || "");
      setTagsString(initialData.tags?.join(", ") || "Portfolio, Mentoring");
      setMediaError("");
    } else {
      setJudul("");
      setDeskripsi("");
      setKategori(currentUser?.kategori_keahlian || "Technology & Software");
      setTanggalPencapaian(new Date().toISOString().split("T")[0]);
      setMedia("");
      setTagsString("Portfolio, Mentoring");
      setMediaError("");
    }
  }, [initialData, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !judul.trim() || !deskripsi.trim()) return;

    // MANDATORY IMAGE UPLOAD VALIDATION
    if (!media || !media.trim()) {
      setMediaError("Unggah foto/gambar pencapaian bersifat wajib!");
      return;
    }

    setIsSubmitting(true);
    setMediaError("");

    const tags = tagsString
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    try {
      if (isEditMode && initialData) {
        await updatePost(initialData.id, {
          judul: judul.trim(),
          deskripsi: deskripsi.trim(),
          media: media.trim(),
          kategori,
          tanggal_pencapaian: tanggalPencapaian,
          tags,
        });
      } else {
        await createPost({
          ahli_id: currentUser.id,
          judul: judul.trim(),
          deskripsi: deskripsi.trim(),
          media: media.trim(),
          kategori,
          tanggal_pencapaian: tanggalPencapaian,
          tags,
        });
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Terjadi kesalahan saat menyimpan postingan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isEditMode ? "Edit Postingan Pencapaian" : "Posting Pencapaian & Portofolio"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditMode
                  ? "Perbarui rincian dokumentasi karya atau studi kasus Anda"
                  : "Bagikan bukti pencapaian dan keahlian Anda kepada komunitas"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSuccessToast && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {isEditMode ? "Postingan berhasil diperbarui!" : "Pencapaian berhasil diposting!"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Judul Pencapaian / Proyek *
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Implementasi Sistem Monitoring Pertanian Cerdas di Minahasa..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Kategori Keahlian *
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Tanggal Pencapaian */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Tanggal Pencapaian *
              </label>
              <input
                type="date"
                required
                value={tanggalPencapaian}
                onChange={(e) => setTanggalPencapaian(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tag / Kata Kunci (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="Cloud, Mentoring, IoT, Desain"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Deskripsi & Dampak Pencapaian *
            </label>
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ceritakan latar belakang tantangan, metodologi/teknologi yang Anda gunakan, dan dampak atau hasil konkret yang diraih..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Local Explorer / Gallery Image Upload (Wajib) */}
          <div className="space-y-1.5">
            <ImageUploadInput
              value={media}
              onChange={(newMedia) => {
                setMedia(newMedia);
                if (newMedia.trim()) setMediaError("");
              }}
              label="Foto / Bukti Pencapaian (Wajib)"
              helperText="Pilih foto dokumentasi karya/sertifikat/proyek dari galeri/folder atau tempel URL gambar."
              className={mediaError ? "ring-2 ring-rose-500 rounded-2xl p-1" : ""}
            />
            {mediaError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold animate-fadeIn pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{mediaError}</span>
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer btn-press"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting
                ? isEditMode
                  ? "Menyimpan Perubahan..."
                  : "Mempublikasikan..."
                : isEditMode
                ? "Simpan Perubahan"
                : "Posting Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
