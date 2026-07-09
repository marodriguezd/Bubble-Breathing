import { useEffect, useRef, useCallback } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';

const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2500, exhale: 1500 },
  standard: { inhale: 2000, exhale: 1000 },
  fast: { inhale: 1000, exhale: 1000 }
};

export const useBreathingTimer = () => {
  const { config } = useSettings();
  const {
    phase, setPhase,
    setCurrentRound,
    setCurrentBreath,
    isPlaying, setIsPlaying
  } = useSession();

  const phaseTimerRef = useRef<number | null>(null);

  const getBreathTiming = useCallback((totalMs: number) => {
    let inhale;
    if (totalMs <= 2000) {
      inhale = totalMs / 2;
    } else if (totalMs <= 3000) {
      inhale = 1000 + (totalMs - 2000); 
    } else {
      inhale = 2000 + (totalMs - 3000) * 0.5;
    }
    return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
  }, []);

  const getTimings = useCallback(() => {
    if (config.speed === 'custom') {
      return getBreathTiming(config.customTime * 1000);
    }
    return speedSettings[config.speed] || speedSettings.standard;
  }, [config.speed, config.customTime, getBreathTiming]);

  const stopTimer = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const runBreathingCycle = useCallback(() => {
    if (!isPlaying || phase !== 'breathing') return;

    const timings = getTimings();
    
    // Increment breath at start of cycle
    setCurrentBreath((prev) => {
      const nextBreath = prev + 1;
      if (nextBreath > config.breaths) {
        // Switch to retention
        setPhase('retention');
        return prev;
      }
      return nextBreath;
    });

    // We assume the caller handles the UI transitions based on 'currentBreath' changing.
    // The cycle repeats after (inhale + exhale)
    phaseTimerRef.current = window.setTimeout(() => {
      runBreathingCycle();
    }, timings.inhale + timings.exhale);
  }, [isPlaying, phase, config.breaths, getTimings, setCurrentBreath, setPhase]);

  useEffect(() => {
    if (isPlaying && phase === 'breathing') {
      runBreathingCycle();
    }
    return stopTimer;
  }, [isPlaying, phase, runBreathingCycle, stopTimer]);

  const startSession = () => {
    setIsPlaying(true);
    setCurrentRound(1);
    setCurrentBreath(0);
    setPhase('breathing');
  };

  const stopSession = () => {
    setIsPlaying(false);
    stopTimer();
  };

  return { startSession, stopSession, getTimings };
};
