"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/seedData";
import { CITY_PRESETS } from "@/lib/geo";
import { ImageUploadInput } from "@/components/common/ImageUploadInput";
import {
  User,
  ArrowLeft,
  Save,
  Award,
  MapPin,
  Sparkles,
  Phone,
  Image as ImageIcon,
  Check,
} from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser, updateProfile, setUserLocation, toggleAccountStatus } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [telepon, setTelepon] = useState(currentUser?.telepon || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [lokasiNama, setLokasiNama] = useState(currentUser?.lokasi_nama || CITY_PRESETS[0].name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!currentUser?.kategori_keahlian) return ["Technology & Software"];
    return currentUser.kategori_keahlian
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  });
  const [deskripsiBio, setDeskripsiBio] = useState(currentUser?.deskripsi_bio || "");
  const [pengalamanTahun, setPengalamanTahun] = useState(currentUser?.pengalaman_tahun || 1);
  const [tagsString, setTagsString] = useState(currentUser?.keahlian_tags?.join(", ") || "");
  const [pendidikan, setPendidikan] = useState(currentUser?.pendidikan || "");
  const [sertifikasiString, setSertifikasiString] = useState(currentUser?.sertifikasi?.join(", ") || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    router.push("/auth/login");
    return null;
  }

  const isExpert = currentUser.role === "AHLI";

  const handleToggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        alert("Pilih minimal 1 kategori keahlian.");
        return;
      }
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleCityChange = (cityName: string) => {
    setLokasiNama(cityName);
    const city = CITY_PRESETS.find((c) => c.name === cityName);
    if (city) {
      setUserLocation({ latitude: city.lat, longitude: city.lng }, city.name);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsString
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const certs = sertifikasiString
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    updateProfile({
      name: name.trim(),
      telepon: telepon.trim(),
      avatar: avatar.trim(),
      lokasi_nama: lokasiNama,
      kategori_keahlian: isExpert ? selectedCategories.join(", ") : undefined,
      deskripsi_bio: isExpert ? deskripsiBio.trim() : undefined,
      pengalaman_tahun: isExpert ? Number(pengalamanTahun) : undefined,
      keahlian_tags: isExpert ? tags : undefined,
      pendidikan: isExpert ? pendidikan.trim() : undefined,
      sertifikasi: isExpert ? certs : undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push("/profile");
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Go Back
        </button>
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Edit Profile
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        {/* Avatar Upload */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <ImageUploadInput
            value={avatar}
            onChange={(newAvatar) => setAvatar(newAvatar)}
            label="Profile Photo / Avatar"
            helperText="Select a photo from your gallery or folder to use as your profile picture"
          />
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              WhatsApp / Phone Number
            </label>
            <input
              type="text"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="+1 555-xxx-xxxx"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            City / Location (Radius Coordinates)
          </label>
          <select
            value={lokasiNama}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          >
            {CITY_PRESETS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Expert Only Fields */}
        {isExpert && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Expert Competency & Portfolio Information
            </h3>

            {/* Multi-Category Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Bidang Keahlian Utama ({selectedCategories.length} Dipilih) *
                </label>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  Pilih 1 atau lebih bidang keahlian
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400"
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 shrink-0 text-white" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Lama Pengalaman (Tahun)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={pengalamanTahun}
                onChange={(e) => setPengalamanTahun(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Bio Description / Experience Summary
              </label>
              <textarea
                rows={3}
                value={deskripsiBio}
                onChange={(e) => setDeskripsiBio(e.target.value)}
                placeholder="Describe your background, expertise focus, and mentoring approach..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Specific Skill Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="Next.js, AWS Cloud, System Design, Figma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Highest Education
              </label>
              <input
                type="text"
                value={pendidikan}
                onChange={(e) => setPendidikan(e.target.value)}
                placeholder="M.S. Computer Science - MIT"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Official Certifications (comma-separated)
              </label>
              <input
                type="text"
                value={sertifikasiString}
                onChange={(e) => setSertifikasiString(e.target.value)}
                placeholder="AWS Certified Solutions Architect, Google UX Professional"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Account Status / Deactivate Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Status Akun & Visibilitas Publik
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentUser.is_active !== false ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <p className="font-bold text-xs text-slate-900 dark:text-white">
                  {currentUser.is_active !== false ? "Akun Aktif (Terlihat Publik)" : "Akun Dinonaktifkan"}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                {currentUser.is_active !== false
                  ? "Akun Anda saat ini aktif. Semua postingan dan profil Anda dapat dilihat di Community Feed dan pencarian pengguna."
                  : "Akun Anda sedang dinonaktifkan. Postingan dan profil Anda disembunyikan dari Community Feed publik."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextStatus = currentUser.is_active === false;
                if (
                  confirm(
                    nextStatus
                      ? "Aktifkan kembali akun Anda agar postingan muncul di Community Feed?"
                      : "Nonaktifkan akun Anda? Postingan Anda tidak akan lagi muncul di Community Feed publik sampai Anda mengaktifkannya kembali."
                  )
                ) {
                  toggleAccountStatus(nextStatus);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                currentUser.is_active !== false
                  ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-800"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              }`}
            >
              {currentUser.is_active !== false ? "Nonaktifkan Akun" : "Aktifkan Akun"}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? "Tersimpan!" : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
