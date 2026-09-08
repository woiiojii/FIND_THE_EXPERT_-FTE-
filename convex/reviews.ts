import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAllReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

export const getReviewsForExpert = query({
  args: {
    ahli_id: v.string(),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_ahli", (q) => q.eq("ahli_id", args.ahli_id))
      .collect();

    return reviews.sort((a, b) => b.created_at - a.created_at);
  },
});

export const submitReview = mutation({
  args: {
    user_id: v.string(),
    ahli_id: v.string(),
    rating: v.number(),
    komentar: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating harus antara 1 sampai 5.");
    }

    const reviewId = await ctx.db.insert("reviews", {
      user_id: args.user_id,
      ahli_id: args.ahli_id,
      rating: args.rating,
      komentar: args.komentar,
      created_at: Date.now(),
    });

    // Recalculate average rating for the expert
    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_ahli", (q) => q.eq("ahli_id", args.ahli_id))
      .collect();

    const expert = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), args.ahli_id)).first();
    if (expert) {
      const avg =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await ctx.db.patch(expert._id, {
        rata_rata_rating: Number(avg.toFixed(1)),
        jumlah_review: allReviews.length,
      });
    }

    return reviewId;
  },
});
