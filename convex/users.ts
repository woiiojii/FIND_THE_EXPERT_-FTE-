import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const listExperts = query({
  args: {
    kategori: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let experts = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "AHLI"))
      .collect();

    // Filter out deactivated accounts
    experts = experts.filter((e) => e.is_active !== false);

    if (args.kategori && args.kategori !== "Semua" && args.kategori !== "All") {
      return experts.filter((e) => e.kategori_keahlian === args.kategori);
    }
    return experts;
  },
});

export const getUserById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      const doc = await ctx.db.get(args.id as any);
      if (doc) return doc;
    } catch {}
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), args.id)).first();
    return user;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const registerUser = mutation({
  args: {
    email: v.string(),
    password: v.optional(v.string()),
    name: v.string(),
    role: v.union(v.literal("USER_BIASA"), v.literal("AHLI")),
    latitude: v.number(),
    longitude: v.number(),
    lokasi_nama: v.optional(v.string()),
    avatar: v.optional(v.string()),
    kategori_keahlian: v.optional(v.string()),
    deskripsi_bio: v.optional(v.string()),
    pengalaman_tahun: v.optional(v.number()),
    telepon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) {
      throw new Error("Email sudah terdaftar.");
    }

    const userId = await ctx.db.insert("users", {
      ...args,
      password: args.password || "123456",
      rata_rata_rating: args.role === "AHLI" ? 5.0 : undefined,
      jumlah_review: args.role === "AHLI" ? 0 : undefined,
      verified: true,
      is_active: true,
      created_at: Date.now(),
    });
    return await ctx.db.get(userId);
  },
});

export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (!user) {
      throw new Error("Akun dengan email ini tidak ditemukan.");
    }
    return user;
  },
});

export const updateProfile = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    lokasi_nama: v.optional(v.string()),
    deskripsi_bio: v.optional(v.string()),
    kategori_keahlian: v.optional(v.string()),
    pengalaman_tahun: v.optional(v.number()),
    telepon: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let user: any = null;
    try {
      user = await ctx.db.get(args.id as any);
    } catch {}
    if (!user) {
      user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), args.id)).first();
    }
    if (!user) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const { id, ...updates } = args;
    await ctx.db.patch(user._id, updates);
    return await ctx.db.get(user._id);
  },
});

export const toggleAccountStatus = mutation({
  args: {
    id: v.string(),
    is_active: v.boolean(),
  },
  handler: async (ctx, args) => {
    let user: any = null;
    try {
      user = await ctx.db.get(args.id as any);
    } catch {}
    if (!user) {
      user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), args.id)).first();
    }
    if (!user) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    await ctx.db.patch(user._id, { is_active: args.is_active });
    return await ctx.db.get(user._id);
  },
});

export const likeUserProfile = mutation({
  args: {
    expertId: v.string(),
  },
  handler: async (ctx, args) => {
    let user: any = null;
    try {
      user = await ctx.db.get(args.expertId as any);
    } catch {}
    if (!user) {
      user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), args.expertId)).first();
    }
    if (!user) {
      throw new Error("Expert profile not found.");
    }
    const currentLikes = user.likes || 0;
    await ctx.db.patch(user._id, { likes: currentLikes + 1 });
    return currentLikes + 1;
  },
});

