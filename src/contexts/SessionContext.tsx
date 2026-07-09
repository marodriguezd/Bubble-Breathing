import React, { createContext, useState, useContext } from 'react';

export type SessionPhase = 'idle' | 'breathing' | 'retention' | 'recovery' | 'finished';
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
  breathSubPhase: BreathSubPhase;
  recoverySubPhase: RecoverySubPhase;
  roundResults: RoundResult[];
  setPhase: (phase: SessionPhase) => void;
  setCurrentRound: (round: number | ((prev: number) => number)) => void;
  setCurrentBreath: (breath: number | ((prev: number) => number)) => void;
  setRetentionTime: (time: number | ((prev: number) => number)) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setBreathSubPhase: (subPhase: BreathSubPhase) => void;
  setRecoverySubPhase: (subPhase: RecoverySubPhase) => void;
  setRoundResults: React.Dispatch<React.SetStateAction<RoundResult[]>>;
  resetSession: () => void;
}

export const SessionContext = createContext<SessionState | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0);
  const [retentionTime, setRetentionTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathSubPhase, setBreathSubPhase] = useState<BreathSubPhase>('idle');
  const [recoverySubPhase, setRecoverySubPhase] = useState<RecoverySubPhase>('idle');
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const resetSession = () => {
    setPhase('idle');
    setCurrentRound(1);
    setCurrentBreath(0);
    setRetentionTime(0);
    setIsPlaying(false);
    setBreathSubPhase('idle');
    setRecoverySubPhase('idle');
    setRoundResults([]);
  };

  return (
    <SessionContext.Provider value={{
      phase, setPhase,
      currentRound, setCurrentRound,
      currentBreath, setCurrentBreath,
      retentionTime, setRetentionTime,
      isPlaying, setIsPlaying,
      breathSubPhase, setBreathSubPhase,
      recoverySubPhase, setRecoverySubPhase,
      roundResults, setRoundResults,
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

