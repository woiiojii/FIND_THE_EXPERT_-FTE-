import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAllChats = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chats").collect();
  },
});

export const getConversation = query({
  args: {
    userId1: v.string(),
    userId2: v.string(),
  },
  handler: async (ctx, args) => {
    const allChats = await ctx.db.query("chats").collect();
    const thread = allChats.filter(
      (c) =>
        (c.pengirim_id === args.userId1 && c.penerima_id === args.userId2) ||
        (c.pengirim_id === args.userId2 && c.penerima_id === args.userId1)
    );
    return thread.sort((a, b) => a.created_at - b.created_at);
  },
});

export const getRecentContacts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter(
      (c) => c.pengirim_id === args.userId || c.penerima_id === args.userId
    );

    const contactMap = new Map<string, { lastMessage: string; timestamp: number; unreadCount: number }>();

    userChats.forEach((c) => {
      const otherId = c.pengirim_id === args.userId ? c.penerima_id : c.pengirim_id;
      const existing = contactMap.get(otherId);
      const isUnread = c.penerima_id === args.userId && !c.dibaca;

      if (!existing || c.created_at > existing.timestamp) {
        contactMap.set(otherId, {
          lastMessage: c.isi_pesan,
          timestamp: c.created_at,
          unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0),
        });
      } else if (isUnread) {
        existing.unreadCount += 1;
      }
    });

    return Array.from(contactMap.entries()).map(([contactId, data]) => ({
      contactId,
      ...data,
    }));
  },
});

export const sendMessage = mutation({
  args: {
    pengirim_id: v.string(),
    penerima_id: v.string(),
    isi_pesan: v.string(),
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("chats", {
      pengirim_id: args.pengirim_id,
      penerima_id: args.penerima_id,
      isi_pesan: args.isi_pesan,
      dibaca: false,
      created_at: Date.now(),
    });
    return chatId;
  },
});

export const markAsRead = mutation({
  args: {
    senderId: v.string(),
    receiverId: v.string(),
  },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("chats")
      .filter((q) =>
        q.and(
          q.eq(q.field("pengirim_id"), args.senderId),
          q.eq(q.field("penerima_id"), args.receiverId),
          q.eq(q.field("dibaca"), false)
        )
      )
      .collect();

    for (const msg of unread) {
      await ctx.db.patch(msg._id, { dibaca: true });
    }
    return true;
  },
});
