import { useEffect, useRef, useCallback } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  playInhaleCue, 
  playExhaleCue, 
  playLastBreathCue, 
  playRetentionMinuteCue,
  playRecoveryCue
} from '../services/zenAudioService';

// Legacy exports for backwards compatibility
export const playTone = (_frequency: number, _duration: number, _volume: number) => {
  // Handled by zenAudioService; kept as no-op or proxy for backward compatibility
};

export const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (_) {}
  }
};

const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2500, exhale: 1500 },
  standard: { inhale: 2000, exhale: 1000 },
  fast: { inhale: 1300, exhale: 700 }
};

export const useBreathingTimer = () => {
  const { config } = useSettings();
  const {
    phase, setPhase,
    setCurrentRound,
    currentBreath, setCurrentBreath,
    setRetentionTime,
    setSessionStartTime,
    isPlaying, setIsPlaying,
    isPaused, setIsPaused,
    breathSubPhase, setBreathSubPhase
  } = useSession();

  const breathRef = useRef(0);
  const breathStartTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const currentSubPhaseRef = useRef<'inhale' | 'exhale' | 'idle'>('idle');

  const getBreathTiming = useCallback((totalMs: number) => {
    // Wim Hof: ~65% inhalación profunda activa, ~35% exhalación pasiva (soltar)
    const inhale = totalMs * 0.65;
    return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
  }, []);

  const getTimings = useCallback(() => {
    if (config.speed === 'custom') {
      return getBreathTiming(config.customTime * 1000);
    }
    return speedSettings[config.speed] || speedSettings.standard;
  }, [config.speed, config.customTime, getBreathTiming]);

  // Stop active animation frames
  const stopLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Main high-precision breath runner
  useEffect(() => {
    if (!isPlaying || phase !== 'breathing') {
      stopLoop();
      return;
    }

    if (isPaused) {
      // Pause: accumulate elapsed time and stop ticking
      if (breathStartTimeRef.current !== null) {
        accumulatedMsRef.current += Date.now() - breathStartTimeRef.current;
        breathStartTimeRef.current = null;
      }
      stopLoop();
      return;
    }

    // Active, unpaused breathing
    const timings = getTimings();
    const totalBreathMs = timings.inhale + timings.exhale;

    // Initialize first breath if just starting
    if (breathStartTimeRef.current === null) {
      breathStartTimeRef.current = Date.now();
      if (breathRef.current === 0) {
        breathRef.current = 1;
        setCurrentBreath(1);
        currentSubPhaseRef.current = 'inhale';
        setBreathSubPhase('inhale');
        playInhaleCue(config.volume, timings.inhale);
      }
    }

    const tick = () => {
      if (breathStartTimeRef.current === null) return;

      const now = Date.now();
      const elapsed = accumulatedMsRef.current + (now - breathStartTimeRef.current);

      if (elapsed < timings.inhale) {
        // Inhaling
        if (currentSubPhaseRef.current !== 'inhale') {
          currentSubPhaseRef.current = 'inhale';
          setBreathSubPhase('inhale');
          const isLast = breathRef.current === config.breaths;
          if (isLast) {
            playLastBreathCue(config.volume);
          } else {
            playInhaleCue(config.volume, timings.inhale);
          }
        }
      } else if (elapsed < totalBreathMs) {
        // Exhaling
        if (currentSubPhaseRef.current !== 'exhale') {
          currentSubPhaseRef.current = 'exhale';
          setBreathSubPhase('exhale');
          playExhaleCue(config.volume, timings.exhale);
        }
      } else {
        // Breath cycle completed! Transition to next breath or retention
        accumulatedMsRef.current = 0;
        breathStartTimeRef.current = Date.now();

        if (breathRef.current >= config.breaths) {
          // All breaths completed for this round -> trigger Apnea Retention!
          stopLoop();
          currentSubPhaseRef.current = 'idle';
          setBreathSubPhase('idle');
          setRetentionTime(0);
          setPhase('retention');
          playLastBreathCue(config.volume);
          return;
        } else {
          // Increment breath count
          breathRef.current += 1;
          setCurrentBreath(breathRef.current);
          currentSubPhaseRef.current = 'inhale';
          setBreathSubPhase('inhale');

          const isNextLast = breathRef.current === config.breaths;
          if (isNextLast) {
            playLastBreathCue(config.volume);
          } else {
            playInhaleCue(config.volume, timings.inhale);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => stopLoop();
  }, [
    isPlaying,
    isPaused,
    phase,
    config.breaths,
    config.volume,
    getTimings,
    setCurrentBreath,
    setBreathSubPhase,
    setPhase,
    setRetentionTime,
    stopLoop
  ]);

  const startSession = () => {
    breathRef.current = 0;
    accumulatedMsRef.current = 0;
    breathStartTimeRef.current = null;
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentRound(1);
    setCurrentBreath(0);
    setRetentionTime(0);
    setSessionStartTime(Date.now());
    setPhase('breathing');
  };

  const stopSession = () => {
    stopLoop();
    breathRef.current = 0;
    accumulatedMsRef.current = 0;
    breathStartTimeRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    setBreathSubPhase('idle');
    setSessionStartTime(null);
  };

  return { startSession, stopSession, getTimings };
};
