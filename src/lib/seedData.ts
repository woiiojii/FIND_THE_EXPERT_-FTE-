import { User, Postingan, ChatMessage, Review } from "@/types";

export const CATEGORIES = [
  "All",
  "Technology & Software",
  "UI/UX & Product Design",
  "Data Science & AI",
  "Agriculture & Agrotechnology",
  "Marine & Maritime Logistics",
  "Business & Accounting",
  "Tourism & Digital Marketing",
  "Legal & Business Compliance",
  "Robotics & Applied IoT",
];

// Bidirectional category matching for legacy Indonesian database values
const CATEGORY_MAP: Record<string, string[]> = {
  All: ["All", "Semua"],
  "Technology & Software": ["Technology & Software", "Teknologi & Software", "Web Developer", "Teknologi"],
  "UI/UX & Product Design": ["UI/UX & Product Design", "Desain UI/UX & Produk", "Desain"],
  "Data Science & AI": ["Data Science & AI", "Data Science"],
  "Agriculture & Agrotechnology": ["Agriculture & Agrotechnology", "Pertanian, Cengkeh & Kelapa", "Pertanian & Agroteknologi", "Pertanian"],
  "Marine & Maritime Logistics": ["Marine & Maritime Logistics", "Perikanan & Logistik Maritim", "Perikanan"],
  "Business & Accounting": ["Business & Accounting", "Bisnis & Akuntansi UMKM", "Bisnis & Akuntansi", "Bisnis"],
  "Tourism & Digital Marketing": ["Tourism & Digital Marketing", "Pariwisata & Digital Marketing", "Digital Marketing"],
  "Legal & Business Compliance": ["Legal & Business Compliance", "Hukum & Legalitas Usaha", "Hukum"],
  "Robotics & Applied IoT": ["Robotics & Applied IoT", "Robotika & IoT Terapan", "Robotika"],
};

export const matchCategory = (itemCategory?: string, selectedCategory: string = "All"): boolean => {
  if (!selectedCategory || selectedCategory === "All" || selectedCategory === "Semua") {
    return true;
  }
  if (!itemCategory) return false;

  const validMatches = CATEGORY_MAP[selectedCategory] || [selectedCategory];
  const itemCats = itemCategory.split(",").map((c) => c.trim().toLowerCase());

  return validMatches.some((val) => {
    const v = val.toLowerCase();
    return itemCats.some((cat) => cat.includes(v) || v.includes(cat));
  });
};

export const INITIAL_USERS: User[] = [];
export const INITIAL_POSTS: Postingan[] = [];
export const INITIAL_CHATS: ChatMessage[] = [];
export const INITIAL_REVIEWS: Review[] = [];
