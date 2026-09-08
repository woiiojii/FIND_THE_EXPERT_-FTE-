"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const directToUserId = searchParams.get("to");

  const { currentUser, allUsers } = useAuth();
  const { getRecentChatUsers } = useData();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (directToUserId) {
      setSelectedUserId(directToUserId);
    } else {
      const recent = getRecentChatUsers();
      if (recent.length > 0) {
        setSelectedUserId(recent[0].user.id);
      } else {
        const firstExpert = (allUsers || []).find((u) => u.role === "AHLI" && u.id !== currentUser?.id);
        if (firstExpert) setSelectedUserId(firstExpert.id);
      }
    }
  }, [directToUserId]);

  return (
    <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 flex animate-fadeIn">
      {/* Sidebar: Chat List */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
          selectedUserId ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatList
          selectedUserId={selectedUserId}
          onSelectUser={(id) => setSelectedUserId(id)}
        />
      </div>

      {/* Main Area: Chat Window */}
      <div
        className={`flex-1 h-full ${
          !selectedUserId ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedUserId ? (
          <ChatWindow
            recipientId={selectedUserId}
            onBack={() => setSelectedUserId(null)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-950">
            <p className="text-xs font-semibold">
              Select a conversation on the left to view messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
