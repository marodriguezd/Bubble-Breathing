import { useEffect, useRef, useCallback } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';

let audioCtx: AudioContext | null = null;
export const playTone = (frequency: number, duration: number, volume: number) => {
  if (volume === 0) return;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration / 1000);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
};

export const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration not supported or blocked:', e);
    }
  }
};

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
    isPlaying, setIsPlaying,
    breathSubPhase, setBreathSubPhase
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
        setBreathSubPhase('idle');
        return prev;
      }

      // Inhale starts
      setBreathSubPhase('inhale');
      playTone(220, 200, config.volume);
      vibrate(30);

      // Schedule Exhale
      phaseTimerRef.current = window.setTimeout(() => {
        setBreathSubPhase('exhale');

        // Schedule next breathing cycle
        phaseTimerRef.current = window.setTimeout(() => {
          runBreathingCycle();
        }, timings.exhale);

      }, timings.inhale);

      return nextBreath;
    });
  }, [isPlaying, phase, config.breaths, config.volume, getTimings, setCurrentBreath, setPhase, setBreathSubPhase]);

  useEffect(() => {
    if (isPlaying && phase === 'breathing') {
      runBreathingCycle();
    }
    return () => {
      stopTimer();
    };
  }, [isPlaying, phase, runBreathingCycle, stopTimer]);

  useEffect(() => {
    if (phase === 'retention' && isPlaying) {
      playTone(150, 800, config.volume);
      vibrate([200, 100, 200, 100, 400]);
    }
  }, [phase, isPlaying, config.volume]);

  const startSession = () => {
    setIsPlaying(true);
    setCurrentRound(1);
    setCurrentBreath(0);
    setPhase('breathing');
  };

  const stopSession = () => {
    setIsPlaying(false);
    setBreathSubPhase('idle');
    stopTimer();
  };

  return { startSession, stopSession, getTimings };
};

