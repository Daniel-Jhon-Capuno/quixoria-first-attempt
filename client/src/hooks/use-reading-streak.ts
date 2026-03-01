import { useState, useEffect } from "react";

const KEY = "quixoria_streak";

interface StreakData {
  current: number;
  longest: number;
  lastReadDate: string | null;
}

export function useReadingStreak() {
  const [streak, setStreak] = useState<StreakData>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null") ?? { current: 0, longest: 0, lastReadDate: null };
    } catch {
      return { current: 0, longest: 0, lastReadDate: null };
    }
  });

  // Call this when the user opens a book
  const recordRead = () => {
    const today = new Date().toISOString().split("T")[0];
    setStreak(prev => {
      if (prev.lastReadDate === today) return prev; // already counted today
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newCurrent = prev.lastReadDate === yesterday ? prev.current + 1 : 1;
      const newLongest = Math.max(newCurrent, prev.longest);
      const next = { current: newCurrent, longest: newLongest, lastReadDate: today };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { streak, recordRead };
}