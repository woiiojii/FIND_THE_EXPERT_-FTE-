"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { User } from "@/types";
import { Star, X, MessageSquare, CheckCircle, Sparkles } from "lucide-react";

interface ReviewModalProps {
  expert: User;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ expert, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { submitReview } = useData();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comment.trim()) return;

    submitReview(expert.id, rating, comment.trim());
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  const RATING_LABELS: Record<number, string> = {
    1: "Needs Much Improvement (1/5)",
    2: "Somewhat Helpful (2/5)",
    3: "Good & Useful (3/5)",
    4: "Very Satisfying (4/5)",
    5: "Outstanding & Highly Recommended! (5/5)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-scaleUp">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Review Submitted!
            </h3>
            <p className="text-xs text-slate-500">
              Thank you for your valuable feedback for {expert.name}.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Rate This Expert
                </h3>
                <p className="text-xs text-slate-500">{expert.name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-100 dark:border-slate-700/50">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Consultation Satisfaction Level
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                  {RATING_LABELS[hoverRating || rating]}
                </p>
              </div>

              {/* Commentary Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Review & Consultation Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the clarity of content, problem-solving ability, and the expert's professionalism during the consultation..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
