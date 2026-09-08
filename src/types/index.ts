export type UserRole = "USER_BIASA" | "AHLI";

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  latitude: number;
  longitude: number;
  avatar?: string;
  lokasi_nama?: string;
  kategori_keahlian?: string;
  deskripsi_bio?: string;
  rata_rata_rating?: number;
  jumlah_review?: number;
  pengalaman_tahun?: number;
  telepon?: string;
  verified?: boolean;
  likes?: number;
  keahlian_tags?: string[];
  pendidikan?: string;
  sertifikasi?: string[];
  is_active?: boolean;
  created_at?: number;
}

export interface Postingan {
  id: string;
  ahli_id: string;
  judul: string;
  deskripsi: string;
  media: string;
  kategori?: string;
  tanggal_pencapaian?: string;
  likes?: number;
  tags?: string[];
  created_at: number;
  author?: User;
}

export interface ChatMessage {
  id: string;
  pengirim_id: string;
  penerima_id: string;
  isi_pesan: string;
  dibaca: boolean;
  created_at: number;
}

export interface Review {
  id: string;
  user_id: string;
  ahli_id: string;
  rating: number; // 1 to 5
  komentar: string;
  created_at: number;
  reviewer_name?: string;
  reviewer_avatar?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ExpertWithDistance extends User {
  distanceKm: number;
  travelTimeMin: number;
}
