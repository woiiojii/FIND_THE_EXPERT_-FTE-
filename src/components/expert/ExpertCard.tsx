"use client";

import React from "react";
import Link from "next/link";
import { ExpertWithDistance } from "@/types";
import {
  Star,
  MapPin,
  Clock,
  Award,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  Heart,
} from "lucide-react";

interface ExpertCardProps {
  expert: ExpertWithDistance;
  onDirectMessage?: (expertId: string) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between card-hover">
      <div>
        {/* Top Header with Avatar and Distance Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={expert.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + expert.name}
                alt={expert.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-105 transition duration-300"
              />
              {expert.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {expert.name}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {(expert.kategori_keahlian || "Expert Mentor")
                  .split(",")
                  .slice(0, 2)
                  .map((cat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/50"
                    >
                      <Award className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[150px]">{cat.trim()}</span>
                    </span>
                  ))}
                {(expert.kategori_keahlian || "").split(",").length > 2 && (
                  <span className="text-[10px] text-slate-400 font-bold px-1">
                    +{(expert.kategori_keahlian || "").split(",").length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Distance Badge */}
          <div className="flex flex-col items-end">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              {expert.distanceKm} km
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" /> ~{expert.travelTimeMin} min
            </span>
          </div>
        </div>

        {/* Bio Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {expert.deskripsi_bio || "Experienced practitioner mentor in North Sulawesi."}
        </p>

        {/* Tags */}
        {expert.keahlian_tags && expert.keahlian_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {expert.keahlian_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                #{tag}
              </span>
            ))}
            {expert.keahlian_tags.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                +{expert.keahlian_tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Metrics and Actions */}
      <div>
        <div className="flex items-center justify-between py-2.5 border-t border-slate-100 dark:border-slate-800/80 mb-3 text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-900 dark:text-white font-extrabold">
              {expert.rata_rata_rating?.toFixed(1) || "5.0"}
            </span>
            <span className="text-slate-400 font-normal">
              ({expert.jumlah_review || 0})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-rose-500 font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>{expert.likes || 0}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{expert.pengalaman_tahun || 1}y exp</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/messages?to=${expert.id}`}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition btn-press"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </Link>

          <Link
            href={`/experts/${expert.id}`}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 transition group-hover:shadow-blue-500/30 btn-press"
          >
            <span>View Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
