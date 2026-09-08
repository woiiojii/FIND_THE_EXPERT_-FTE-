"use client";

import React from "react";
import { CATEGORIES } from "@/lib/seedData";
import {
  Code,
  Smartphone,
  Palette,
  Brain,
  ShieldCheck,
  Cloud,
  Cpu,
  Database,
  Server,
  Layers,
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All: Layers,
  Semua: Layers,
  "Technology & Software": Code,
  "Mobile App Development": Smartphone,
  "UI/UX & Product Design": Palette,
  "Data Science & AI": Brain,
  "Cybersecurity & Network": ShieldCheck,
  "Cloud & DevOps": Cloud,
  "Robotics & Applied IoT": Cpu,
  "Database & Systems Architecture": Database,
  "IT Support & Infrastructure": Server,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const Icon = CATEGORY_ICONS[category] || Layers;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                  : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-500"}`} />
              <span>{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
