import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAllPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("postingan").order("desc").collect();
    const users = await ctx.db.query("users").collect();
    
    // Map inactive users (is_active === false)
    const inactiveUserIds = new Set<string>();
    users.forEach((u) => {
      if (u.is_active === false) {
        inactiveUserIds.add(u._id);
      }
    });

    // Filter out posts from deactivated accounts
    return posts.filter((p) => !inactiveUserIds.has(p.ahli_id));
  },
});

export const listPosts = query({
  args: {
    kategori: v.optional(v.string()),
    ahli_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("postingan").order("desc").collect();
    const users = await ctx.db.query("users").collect();

    const inactiveUserIds = new Set<string>();
    users.forEach((u) => {
      if (u.is_active === false) {
        inactiveUserIds.add(u._id);
      }
    });

    if (args.ahli_id) {
      posts = posts.filter((p) => p.ahli_id === args.ahli_id);
    } else {
      // For general feed, hide posts from deactivated accounts
      posts = posts.filter((p) => !inactiveUserIds.has(p.ahli_id));
    }

    if (args.kategori && args.kategori !== "Semua" && args.kategori !== "All") {
      posts = posts.filter((p) => p.kategori === args.kategori);
    }
    return posts;
  },
});

export const createPost = mutation({
  args: {
    ahli_id: v.string(),
    judul: v.string(),
    deskripsi: v.string(),
    media: v.string(),
    kategori: v.optional(v.string()),
    tanggal_pencapaian: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if (!args.media || !args.media.trim()) {
      throw new Error("Foto / gambar postingan wajib diunggah.");
    }

    const postId = await ctx.db.insert("postingan", {
      ahli_id: args.ahli_id,
      judul: args.judul,
      deskripsi: args.deskripsi,
      media: args.media.trim(),
      kategori: args.kategori || "Technology & Software",
      tanggal_pencapaian: args.tanggal_pencapaian || new Date().toISOString().split("T")[0],
      tags: args.tags || [],
      likes: 0,
      created_at: Date.now(),
    });
    return postId;
  },
});

export const updatePost = mutation({
  args: {
    id: v.string(),
    judul: v.string(),
    deskripsi: v.string(),
    media: v.string(),
    kategori: v.optional(v.string()),
    tanggal_pencapaian: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if (!args.media || !args.media.trim()) {
      throw new Error("Foto / gambar postingan wajib diunggah.");
    }

    let post: any = null;
    try {
      post = await ctx.db.get(args.id as any);
    } catch {}
    if (!post) {
      post = await ctx.db.query("postingan").filter((q) => q.eq(q.field("_id"), args.id)).first();
    }
    if (!post) {
      throw new Error("Postingan tidak ditemukan.");
    }
    const { id, ...updates } = args;
    await ctx.db.patch(post._id, updates);
    return true;
  },
});

export const likePost = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    let post: any = null;
    try {
      post = await ctx.db.get(args.id as any);
    } catch {}
    if (!post) {
      post = await ctx.db.query("postingan").filter((q) => q.eq(q.field("_id"), args.id)).first();
    }
    if (post) {
      const currentLikes = post.likes || 0;
      await ctx.db.patch(post._id, { likes: currentLikes + 1 });
      return currentLikes + 1;
    }
    return 0;
  },
});

export const deletePost = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    let post: any = null;
    try {
      post = await ctx.db.get(args.id as any);
    } catch {}
    if (!post) {
      post = await ctx.db.query("postingan").filter((q) => q.eq(q.field("_id"), args.id)).first();
    }
    if (post) {
      await ctx.db.delete(post._id);
      return true;
    }
    return false;
  },
});
