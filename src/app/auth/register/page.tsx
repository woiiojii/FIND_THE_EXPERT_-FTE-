"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { CATEGORIES } from "@/lib/seedData";
import { CITY_PRESETS } from "@/lib/geo";
import {
  Compass,
  User,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Lock,
  Mail,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>("USER_BIASA");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lokasiNama, setLokasiNama] = useState(CITY_PRESETS[0].name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([CATEGORIES[1]]);
  const [deskripsiBio, setDeskripsiBio] = useState("");
  const [pengalamanTahun, setPengalamanTahun] = useState(3);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const city = CITY_PRESETS.find((c) => c.name === lokasiNama) || CITY_PRESETS[0];

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        role,
        latitude: city.lat,
        longitude: city.lng,
        lokasi_nama: city.name,
        kategori_keahlian: role === "AHLI" ? selectedCategories.join(", ") : undefined,
        deskripsi_bio: role === "AHLI" ? deskripsiBio.trim() : undefined,
        pengalaman_tahun: role === "AHLI" ? Number(pengalamanTahun) : undefined,
      });

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Create a New Account
        </h1>
        <p className="text-xs text-slate-500">
          Choose your role to start collaborating on Find The Expert (FTE)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs font-medium border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Select Account Role *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("USER_BIASA")}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                role === "USER_BIASA"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <User className={`w-5 h-5 mb-2 ${role === "USER_BIASA" ? "text-blue-600" : "text-slate-400"}`} />
              <div>
                <p className="font-extrabold text-xs">Expert Seeker</p>
                <p className="text-[10px] text-slate-500">Community & Learner</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("AHLI")}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                role === "AHLI"
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Award className={`w-5 h-5 mb-2 ${role === "AHLI" ? "text-emerald-600" : "text-slate-400"}`} />
              <div>
                <p className="font-extrabold text-xs">Expert / Mentor</p>
                <p className="text-[10px] text-slate-500">Practitioner & Consultant</p>
              </div>
            </button>
          </div>
        </div>

        {/* Basic Fields */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., John Smith"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Password *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            City / Location (GPS) *
          </label>
          <select
            value={lokasiNama}
            onChange={(e) => setLokasiNama(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          >
            {CITY_PRESETS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Expert Specific Registration Fields */}
        {role === "AHLI" && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Expert Qualifications
            </h4>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Primary Expertise Categories *
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  (Pilih satu atau lebih: {selectedCategories.length} dipilih)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition flex items-center justify-between gap-1.5 border ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Bio Summary & Competencies
              </label>
              <textarea
                rows={2}
                value={deskripsiBio}
                onChange={(e) => setDeskripsiBio(e.target.value)}
                placeholder="Describe your area of specialization and experience..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 pt-2"
        >
          <span>{isLoading ? "Registering..." : "Create Account"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
            Sign In Here
          </Link>
        </p>
      </form>
    </div>
  );
}
