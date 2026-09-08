"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
  Postingan,
  ChatMessage,
  Review,
  User,
  ExpertWithDistance,
} from "@/types";
import { useAuth } from "./AuthContext";
import { calculateDistanceKm, estimateTravelTimeMinutes } from "@/lib/geo";
import { matchCategory } from "@/lib/seedData";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

interface DataContextType {
  posts: Postingan[];
  chats: ChatMessage[];
  reviews: Review[];
  deletePost: (postId: string) => Promise<void>;
  updatePost: (postId: string, data: { judul: string; deskripsi: string; media: string; kategori?: string; tanggal_pencapaian?: string; tags?: string[] }) => Promise<void>;
  createPost: (newPost: Omit<Postingan, "id" | "likes" | "created_at">) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  likeUserProfile: (expertId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getConversation: (userId1: string, userId2: string) => ChatMessage[];
  getRecentChatUsers: () => { user: User; lastMessage: string; timestamp: number; unreadCount: number }[];
  markChatAsRead: (otherUserId: string) => Promise<void>;
  submitReview: (expertId: string, rating: number, comment: string) => Promise<void>;
  getReviewsForExpert: (expertId: string) => Review[];
  getFilteredExperts: (options: {
    category?: string;
    maxDistanceKm?: number;
    searchQuery?: string;
    sortBy?: "distance" | "rating" | "reviews";
  }) => ExpertWithDistance[];
  getExpertById: (id: string) => User | undefined;
  allUsers: User[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userLocation, allUsers } = useAuth();

  // Convex Reactive Queries
  const convexPosts = useQuery(api.postingan.listAllPosts);
  const convexChats = useQuery(api.chats.listAllChats);
  const convexReviews = useQuery(api.reviews.listAllReviews);

  // Convex Mutations
  const createPostMutation = useMutation(api.postingan.createPost);
  const updatePostMutation = useMutation(api.postingan.updatePost);
  const likePostMutation = useMutation(api.postingan.likePost);
  const deletePostMutation = useMutation(api.postingan.deletePost);
  const likeUserProfileMutation = useMutation(api.users.likeUserProfile);
  const sendMessageMutation = useMutation(api.chats.sendMessage);
  const markAsReadMutation = useMutation(api.chats.markAsRead);
  const submitReviewMutation = useMutation(api.reviews.submitReview);

  // Transform Convex Posts to Postingan[] (filter out inactive experts)
  const posts: Postingan[] = useMemo(() => {
    if (!convexPosts) return [];
    const inactiveUserIds = new Set<string>(
      allUsers.filter((u) => u.is_active === false).map((u) => u.id)
    );
    return convexPosts
      .filter((p: any) => !inactiveUserIds.has(p.ahli_id))
      .map((p: any) => ({
        id: p._id,
        ahli_id: p.ahli_id,
        judul: p.judul,
        deskripsi: p.deskripsi,
        media: p.media,
        kategori: p.kategori,
        tanggal_pencapaian: p.tanggal_pencapaian,
        likes: p.likes || 0,
        tags: p.tags,
        created_at: p.created_at || p._creationTime,
      }));
  }, [convexPosts, allUsers]);

  // Transform Convex Chats to ChatMessage[]
  const chats: ChatMessage[] = useMemo(() => {
    if (!convexChats) return [];
    return convexChats.map((c: any) => ({
      id: c._id,
      pengirim_id: c.pengirim_id,
      penerima_id: c.penerima_id,
      isi_pesan: c.isi_pesan,
      dibaca: c.dibaca,
      created_at: c.created_at || c._creationTime,
    }));
  }, [convexChats]);

  // Transform Convex Reviews to Review[]
  const reviews: Review[] = useMemo(() => {
    if (!convexReviews) return [];
    return convexReviews.map((r: any) => {
      const reviewer = allUsers.find((u) => u.id === r.user_id);
      return {
        id: r._id,
        user_id: r.user_id,
        ahli_id: r.ahli_id,
        rating: r.rating,
        komentar: r.komentar,
        created_at: r.created_at || r._creationTime,
        reviewer_name: reviewer?.name,
        reviewer_avatar: reviewer?.avatar,
      };
    });
  }, [convexReviews, allUsers]);

  const createPost = async (newPost: Omit<Postingan, "id" | "likes" | "created_at">) => {
    try {
      await createPostMutation({
        ahli_id: newPost.ahli_id,
        judul: newPost.judul,
        deskripsi: newPost.deskripsi,
        media: newPost.media,
        kategori: newPost.kategori,
        tanggal_pencapaian: newPost.tanggal_pencapaian,
        tags: newPost.tags,
      });
    } catch (e) {
      console.error("Failed to create post in Convex:", e);
      throw e;
    }
  };

  const updatePost = async (
    postId: string,
    data: { judul: string; deskripsi: string; media: string; kategori?: string; tanggal_pencapaian?: string; tags?: string[] }
  ) => {
    try {
      await updatePostMutation({
        id: postId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        media: data.media,
        kategori: data.kategori,
        tanggal_pencapaian: data.tanggal_pencapaian,
        tags: data.tags,
      });
    } catch (e) {
      console.error("Failed to update post in Convex:", e);
      throw e;
    }
  };

  const likePost = async (postId: string) => {
    try {
      await likePostMutation({ id: postId });
    } catch (e) {
      console.error("Failed to like post in Convex:", e);
    }
  };

  const likeUserProfile = async (expertId: string) => {
    try {
      await likeUserProfileMutation({ expertId });
    } catch (e) {
      console.error("Failed to like expert profile in Convex:", e);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await deletePostMutation({ id: postId });
    } catch (e) {
      console.error("Failed to delete post in Convex:", e);
      throw e;
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    try {
      await sendMessageMutation({
        pengirim_id: currentUser.id,
        penerima_id: receiverId,
        isi_pesan: content.trim(),
      });
    } catch (e) {
      console.error("Failed to send message in Convex:", e);
    }
  };

  const markChatAsRead = async (otherUserId: string) => {
    if (!currentUser) return;
    try {
      await markAsReadMutation({
        senderId: otherUserId,
        receiverId: currentUser.id,
      });
    } catch (e) {
      console.error("Failed to mark chat as read in Convex:", e);
    }
  };

  const getConversation = (userId1: string, userId2: string): ChatMessage[] => {
    return chats
      .filter(
        (c) =>
          (c.pengirim_id === userId1 && c.penerima_id === userId2) ||
          (c.pengirim_id === userId2 && c.penerima_id === userId1)
      )
      .sort((a, b) => a.created_at - b.created_at);
  };

  const getRecentChatUsers = () => {
    if (!currentUser) return [];

    const userMap = new Map<string, { lastMessage: string; timestamp: number; unreadCount: number }>();

    chats.forEach((c) => {
      if (c.pengirim_id === currentUser.id || c.penerima_id === currentUser.id) {
        const otherId = c.pengirim_id === currentUser.id ? c.penerima_id : c.pengirim_id;
        const isUnread = c.penerima_id === currentUser.id && !c.dibaca;
        const existing = userMap.get(otherId);

        if (!existing || c.created_at > existing.timestamp) {
          userMap.set(otherId, {
            lastMessage: c.isi_pesan,
            timestamp: c.created_at,
            unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0),
          });
        } else if (isUnread) {
          existing.unreadCount += 1;
        }
      }
    });

    const result: { user: User; lastMessage: string; timestamp: number; unreadCount: number }[] = [];

    userMap.forEach((meta, otherId) => {
      const user = allUsers.find((u) => u.id === otherId);
      if (user) {
        result.push({
          user,
          ...meta,
        });
      }
    });

    return result.sort((a, b) => b.timestamp - a.timestamp);
  };

  const submitReview = async (expertId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    try {
      await submitReviewMutation({
        user_id: currentUser.id,
        ahli_id: expertId,
        rating,
        komentar: comment,
      });
    } catch (e) {
      console.error("Failed to submit review in Convex:", e);
    }
  };

  const getReviewsForExpert = (expertId: string): Review[] => {
    return reviews
      .filter((r) => r.ahli_id === expertId)
      .sort((a, b) => b.created_at - a.created_at);
  };

  const getFilteredExperts = (options: {
    category?: string;
    maxDistanceKm?: number;
    searchQuery?: string;
    sortBy?: "distance" | "rating" | "reviews";
  }): ExpertWithDistance[] => {
    const experts = allUsers.filter((u) => u.role === "AHLI" && u.is_active !== false);

    const withDistance: ExpertWithDistance[] = experts.map((expert) => {
      const hasCoords =
        typeof expert.latitude === "number" &&
        typeof expert.longitude === "number" &&
        !isNaN(expert.latitude) &&
        !isNaN(expert.longitude) &&
        (expert.latitude !== 0 || expert.longitude !== 0);

      const distanceKm = hasCoords
        ? calculateDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            expert.latitude,
            expert.longitude
          )
        : 0;
      const travelTimeMin = estimateTravelTimeMinutes(distanceKm);
      return {
        ...expert,
        distanceKm,
        travelTimeMin,
      };
    });

    return withDistance
      .filter((expert) => {
        // Category filter - handle "All" / "Semua" and bidirectional English/Indonesian match
        if (options.category && options.category !== "All" && options.category !== "Semua") {
          if (!matchCategory(expert.kategori_keahlian, options.category)) return false;
        }
        // Distance filter - only filter out if coordinates exist and distance exceeds max
        if (options.maxDistanceKm && options.maxDistanceKm > 0) {
          const hasCoords =
            typeof expert.latitude === "number" &&
            typeof expert.longitude === "number" &&
            (expert.latitude !== 0 || expert.longitude !== 0);
          if (hasCoords && expert.distanceKm > options.maxDistanceKm) return false;
        }
        // Search query filter
        if (options.searchQuery && options.searchQuery.trim() !== "") {
          const q = options.searchQuery.toLowerCase();
          const matchName = expert.name?.toLowerCase().includes(q);
          const matchBio = expert.deskripsi_bio?.toLowerCase().includes(q);
          const matchCat = expert.kategori_keahlian?.toLowerCase().includes(q);
          const matchTags = expert.keahlian_tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBio && !matchCat && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (options.sortBy === "rating") {
          return (b.rata_rata_rating || 0) - (a.rata_rata_rating || 0);
        }
        if (options.sortBy === "reviews") {
          return (b.jumlah_review || 0) - (a.jumlah_review || 0);
        }
        return a.distanceKm - b.distanceKm;
      });
  };

  const getExpertById = (id: string): User | undefined => {
    return allUsers.find((u) => u.id === id || (u as any)._id === id);
  };

  return (
    <DataContext.Provider
      value={{
        posts,
        chats,
        reviews,
        createPost,
        updatePost,
        likePost,
        likeUserProfile,
        deletePost,
        sendMessage,
        getConversation,
        getRecentChatUsers,
        markChatAsRead,
        submitReview,
        getReviewsForExpert,
        getFilteredExperts,
        getExpertById,
        allUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
