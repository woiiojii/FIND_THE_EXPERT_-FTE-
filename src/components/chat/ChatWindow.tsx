"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, ChatMessage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import {
  Send,
  ArrowLeft,
  Award,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  CheckCheck,
} from "lucide-react";

interface ChatWindowProps {
  recipientId: string;
  onBack?: () => void;
}

const CONVERSATION_STARTERS = [
  "Hi! I'm interested in consulting about our project...",
  "Could you share your availability for a mentoring session this week?",
  "Would you be able to review my portfolio and system implementation?",
  "I need technical recommendations and solutions for my business needs...",
];

export const ChatWindow: React.FC<ChatWindowProps> = ({ recipientId, onBack }) => {
  const { currentUser, allUsers } = useAuth();
  const { getConversation, sendMessage, markChatAsRead } = useData();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recipient = (allUsers || []).find((u) => u.id === recipientId);
  const conversation = currentUser ? getConversation(currentUser.id, recipientId) : [];

  useEffect(() => {
    if (recipientId) {
      markChatAsRead(recipientId);
    }
  }, [recipientId, conversation.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    sendMessage(recipientId, inputText.trim());
    setInputText("");
  };

  const handleUseStarter = (starter: string) => {
    if (!currentUser) return;
    sendMessage(recipientId, starter);
  };

  if (!recipient) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Select a contact on the left to start a conversation.
        </p>
      </div>
    );
  }

  const formatMessageTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/50 dark:bg-slate-950">
      {/* Top Header */}
      <div className="p-3.5 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <img
              src={recipient.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + recipient.name}
              alt={recipient.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {recipient.name}
              </h3>
              {recipient.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" />
              {recipient.kategori_keahlian || "FTE User"}
            </p>
          </div>
        </div>

        {recipient.role === "AHLI" && (
          <Link
            href={`/experts/${recipient.id}`}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900"
          >
            View Profile
          </Link>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Start a Consultation with {recipient.name}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Send a direct message to discuss mentoring, project reviews, or technical solutions.
              </p>
            </div>

            {/* Starter Chips */}
            <div className="w-full max-w-md space-y-2 pt-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Quick Conversation Starters:
              </p>
              {CONVERSATION_STARTERS.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUseStarter(starter)}
                  className="w-full text-left p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs text-slate-700 dark:text-slate-300 font-medium transition hover:shadow-sm"
                >
                  💬 {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.map((msg) => {
            const isMe = msg.pengirim_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-3xl p-3.5 shadow-sm text-xs leading-relaxed ${
                    isMe
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.isi_pesan}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isMe ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    <span>{formatMessageTime(msg.created_at)}</span>
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${recipient.name.split(" ")[0]}...`}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-lg shadow-blue-500/25 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
