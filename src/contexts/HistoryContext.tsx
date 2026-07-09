import React, { createContext, useState, useEffect, useContext } from 'react';

export interface SessionHistory {
  id: string;
  date: string;
  retentionSeconds: number;
  rounds: number;
  speed: string;
}

export interface HistoryState {
  history: SessionHistory[];
  currentStreak: number;
  longestStreak: number;
  addSession: (session: Omit<SessionHistory, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

export const HistoryContext = createContext<HistoryState | null>(null);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [history, setHistory] = useState<SessionHistory[]>(() => {
    const saved = localStorage.getItem('bubbleBreathingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    localStorage.setItem('bubbleBreathingHistory', JSON.stringify(history));
    
    // Calculate streaks
    if (history.length === 0) return;
    
    const dates = [...new Set(history.map(h => new Date(h.date).toDateString()))]
      .map(d => new Date(d).getTime())
      .sort((a, b) => b - a); // Descending

    if (dates.length === 0) return;

    let current = 1;
    let longest = 1;
    let tempStreak = 1;

    // Check current streak (must include today or yesterday)
    const today = new Date().setHours(0,0,0,0);
    const lastSession = new Date(dates[0]).setHours(0,0,0,0);
    const diffDays = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      current = 0;
    }

    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]).setHours(0,0,0,0);
      const d2 = new Date(dates[i+1]).setHours(0,0,0,0);
      const diff = Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        tempStreak++;
        if (i === 0 || current === tempStreak - 1) current = tempStreak;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    setCurrentStreak(current);
    setLongestStreak(Math.max(longest, current));

  }, [history]);

  const addSession = (session: Omit<SessionHistory, 'id' | 'date'>) => {
    const newSession: SessionHistory = {
      ...session,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setHistory(prev => [newSession, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentStreak(0);
    setLongestStreak(0);
  };

  return (
    <HistoryContext.Provider value={{ history, currentStreak, longestStreak, addSession, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};
