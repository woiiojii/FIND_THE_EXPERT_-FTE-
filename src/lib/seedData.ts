import { User, Postingan, ChatMessage, Review } from "@/types";

export const CATEGORIES = [
  "All",
  "Technology & Software",
  "Mobile App Development",
  "UI/UX & Product Design",
  "Data Science & AI",
  "Cybersecurity & Network",
  "Cloud & DevOps",
  "Robotics & Applied IoT",
  "Database & Systems Architecture",
  "IT Support & Infrastructure",
];

// Bidirectional category matching for legacy and bilingual database values
const CATEGORY_MAP: Record<string, string[]> = {
  All: ["All", "Semua"],
  "Technology & Software": ["Technology & Software", "Teknologi & Software", "Web Developer", "Teknologi", "Software Engineering", "Fullstack"],
  "Mobile App Development": ["Mobile App Development", "Mobile Developer", "Android", "iOS", "Flutter", "React Native"],
  "UI/UX & Product Design": ["UI/UX & Product Design", "Desain UI/UX & Produk", "Desain", "UI/UX", "Product Design"],
  "Data Science & AI": ["Data Science & AI", "Data Science", "Machine Learning", "AI", "Artificial Intelligence"],
  "Cybersecurity & Network": ["Cybersecurity & Network", "Keamanan Siber & Jaringan", "Cybersecurity", "Network", "Jaringan", "Security"],
  "Cloud & DevOps": ["Cloud & DevOps", "Cloud Computing", "DevOps", "Cloud", "SRE", "Infrastructure"],
  "Robotics & Applied IoT": ["Robotics & Applied IoT", "Robotika & IoT Terapan", "Robotika", "IoT", "Internet of Things", "Hardware"],
  "Database & Systems Architecture": ["Database & Systems Architecture", "Basis Data & Arsitektur Sistem", "Database", "DBA", "System Architect"],
  "IT Support & Infrastructure": ["IT Support & Infrastructure", "Dukungan IT & Infrastruktur", "IT Support", "Helpdesk", "Infrastruktur IT"],
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
