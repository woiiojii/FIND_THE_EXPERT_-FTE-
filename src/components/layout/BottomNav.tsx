"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MessageSquare, User } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { chats } = useData();

  // Count unread messages for current user
  const unreadCount = currentUser
    ? chats.filter((c) => c.penerima_id === currentUser.id && !c.dibaca).length
    : 0;

  const navItems =
    currentUser?.role === "AHLI"
      ? [
          { name: "Workspace", href: "/home", icon: Home },
          { name: "Map", href: "/find", icon: Compass },
          {
            name: "Messages",
            href: "/messages",
            icon: MessageSquare,
            badge: unreadCount > 0 ? unreadCount : undefined,
          },
          { name: "Profile", href: "/profile", icon: User },
        ]
      : [
          { name: "Home", href: "/home", icon: Home },
          { name: "Find", href: "/find", icon: Compass },
          {
            name: "Messages",
            href: "/messages",
            icon: MessageSquare,
            badge: unreadCount > 0 ? unreadCount : undefined,
          },
          { name: "Profile", href: "/profile", icon: User },
        ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden glass-nav shadow-lg border-t border-slate-200/80 dark:border-slate-800/80 px-1 py-1 transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? currentUser?.role === "AHLI"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <span
                  className={`absolute inset-0 rounded-2xl opacity-10 ${
                    currentUser?.role === "AHLI"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }`}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? "stroke-[2.5] scale-110" : "stroke-[1.8]"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center px-1 animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-0.5 font-medium transition-all ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {item.name}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span
                  className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${
                    currentUser?.role === "AHLI"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
