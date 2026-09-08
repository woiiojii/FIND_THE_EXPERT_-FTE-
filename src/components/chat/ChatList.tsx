"use client";

import React, { useState } from "react";
import { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Search, Award, ShieldCheck, Clock, MessageSquarePlus } from "lucide-react";

interface ChatListProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ selectedUserId, onSelectUser }) => {
  const { currentUser, allUsers } = useAuth();
  const { getRecentChatUsers } = useData();
  const [search, setSearch] = useState("");

  const recentThreads = getRecentChatUsers();

  // All available experts if no chats exist
  const allExperts = (allUsers || []).filter((u) => u.role === "AHLI" && u.id !== currentUser?.id);

  const filteredThreads = recentThreads.filter((t) =>
    t.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const timeAgo = (timestamp: number) => {
    const diffMinutes = Math.round((Date.now() - timestamp) / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.round(diffHours / 24)}d`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Chat Header & Search */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
          Messages
        </h2>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts or users..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => {
            const isSelected = selectedUserId === thread.user.id;
            return (
              <button
                key={thread.user.id}
                onClick={() => onSelectUser(thread.user.id)}
                className={`w-full p-4 flex items-start gap-3 text-left transition ${
                  isSelected
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + thread.user.name}
                    alt={thread.user.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                  {thread.user.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {thread.user.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {timeAgo(thread.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-snug">
                    {thread.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1.5">
                    {thread.user.kategori_keahlian ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Award className="w-3 h-3" /> {thread.user.kategori_keahlian.split("&")[0]}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">User</span>
                    )}

                    {thread.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                        {thread.unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-6 text-center">
            <p className="text-xs text-slate-500 mb-3">No active conversations yet.</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Start chatting with an Expert:
            </p>
            <div className="space-y-2">
              {allExperts.slice(0, 3).map((expert) => (
                <button
                  key={expert.id}
                  onClick={() => onSelectUser(expert.id)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-left transition"
                >
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {expert.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium truncate">
                      {expert.kategori_keahlian}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
