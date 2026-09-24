import React, { createContext, useState, useContext, useCallback } from 'react';

export type SessionPhase = 'idle' | 'breathing' | 'retention' | 'recovery' | 'finished' | 'stats';
export type BreathSubPhase = 'inhale' | 'exhale' | 'idle';
export type RecoverySubPhase = 'inhaling' | 'holding' | 'exhaling' | 'idle';

export interface RoundResult {
  round: number;
  retentionTime: number;
}

interface SessionState {
  phase: SessionPhase;
  currentRound: number;
  currentBreath: number;
  retentionTime: number;
  isPlaying: boolean;
  isPaused: boolean;
  breathSubPhase: BreathSubPhase;
  recoverySubPhase: RecoverySubPhase;
  roundResults: RoundResult[];
  sessionStartTime: number | null;
  setPhase: (phase: SessionPhase) => void;
  setCurrentRound: (round: number | ((prev: number) => number)) => void;
  setCurrentBreath: (breath: number | ((prev: number) => number)) => void;
  setRetentionTime: (time: number | ((prev: number) => number)) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  togglePause: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  setBreathSubPhase: (subPhase: BreathSubPhase) => void;
  setRecoverySubPhase: (subPhase: RecoverySubPhase) => void;
  setRoundResults: React.Dispatch<React.SetStateAction<RoundResult[]>>;
  setSessionStartTime: (time: number | null) => void;
  resetSession: () => void;
}

export const SessionContext = createContext<SessionState | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0);
  const [retentionTime, setRetentionTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathSubPhase, setBreathSubPhase] = useState<BreathSubPhase>('idle');
  const [recoverySubPhase, setRecoverySubPhase] = useState<RecoverySubPhase>('idle');
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const pauseSession = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const resetSession = useCallback(() => {
    setPhase('idle');
    setCurrentRound(1);
    setCurrentBreath(0);
    setRetentionTime(0);
    setIsPlaying(false);
    setIsPaused(false);
    setBreathSubPhase('idle');
    setRecoverySubPhase('idle');
    setRoundResults([]);
    setSessionStartTime(null);
  }, []);

  React.useEffect(() => {
    const isActive = ['breathing', 'retention', 'recovery'].includes(phase);
    window.dispatchEvent(new CustomEvent('omega-session-state', {
      detail: { active: isActive, isPaused, app: 'bubble' }
    }));
  }, [phase, isPaused]);

  React.useEffect(() => {
    const handlePauseSession = (e: any) => {
      if (typeof e.detail?.pause === 'boolean') {
        setIsPaused(e.detail.pause);
      }
    };
    window.addEventListener('omega-pause-session', handlePauseSession);
    return () => window.removeEventListener('omega-pause-session', handlePauseSession);
  }, []);

  return (
    <SessionContext.Provider value={{
      phase, setPhase,
      currentRound, setCurrentRound,
      currentBreath, setCurrentBreath,
      retentionTime, setRetentionTime,
      isPlaying, setIsPlaying,
      isPaused, setIsPaused,
      togglePause, pauseSession, resumeSession,
      breathSubPhase, setBreathSubPhase,
      recoverySubPhase, setRecoverySubPhase,
      roundResults, setRoundResults,
      sessionStartTime, setSessionStartTime,
      resetSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};
