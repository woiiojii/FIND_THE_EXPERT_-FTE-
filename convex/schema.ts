import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema Definition for "Find The Expert (FTE)"
 * Active Tables:
 * - users
 * - postingan
 * - chats
 * - reviews
 */
export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.optional(v.string()),
    name: v.string(),
    role: v.union(v.literal("USER_BIASA"), v.literal("AHLI")),
    latitude: v.number(),
    longitude: v.number(),
    avatar: v.optional(v.string()),
    lokasi_nama: v.optional(v.string()),
    kategori_keahlian: v.optional(v.string()), // Optional, Ahli only
    deskripsi_bio: v.optional(v.string()),     // Optional, Ahli only
    rata_rata_rating: v.optional(v.number()),  // Optional, Ahli only (1-5)
    jumlah_review: v.optional(v.number()),     // Optional, Ahli only
    pengalaman_tahun: v.optional(v.number()),  // Optional, Ahli only
    telepon: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    likes: v.optional(v.number()),
    keahlian_tags: v.optional(v.array(v.string())),
    pendidikan: v.optional(v.string()),
    sertifikasi: v.optional(v.array(v.string())),
    is_active: v.optional(v.boolean()),
    created_at: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_kategori", ["kategori_keahlian"]),

  postingan: defineTable({
    ahli_id: v.string(), // Id<"users"> or user identifier
    judul: v.string(),
    deskripsi: v.string(),
    media: v.optional(v.string()), // Image/document URL or base64
    kategori: v.optional(v.string()),
    tanggal_pencapaian: v.optional(v.string()), // Tanggal pencapaian / achievement date
    likes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    created_at: v.optional(v.number()),
  })
    .index("by_ahli", ["ahli_id"])
    .index("by_kategori", ["kategori"]),

  chats: defineTable({
    pengirim_id: v.string(),
    penerima_id: v.string(),
    isi_pesan: v.string(),
    dibaca: v.boolean(),
    created_at: v.number(),
  })
    .index("by_pengirim", ["pengirim_id"])
    .index("by_penerima", ["penerima_id"]),

  reviews: defineTable({
    user_id: v.string(), // Id<"users"> of the reviewer
    ahli_id: v.string(), // Id<"users"> of the expert being reviewed
    rating: v.number(),  // 1-5 scale
    komentar: v.string(),
    created_at: v.number(),
  })
    .index("by_ahli", ["ahli_id"])
    .index("by_user", ["user_id"]),
});
