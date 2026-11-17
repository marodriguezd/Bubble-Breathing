import { useEffect, useRef, useCallback } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  playInhaleCue, 
  playExhaleCue, 
  playLastBreathCue, 
  triggerHaptic
} from '../services/zenAudioService';

export const playTone = (_frequency: number, _duration: number, _volume: number) => {
  // Handled by zenAudioService; kept as no-op for backward compatibility
};

export const vibrate = (pattern: number | number[]) => {
  triggerHaptic('medium', pattern).catch(() => {});
};

export const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2300, exhale: 1700 },
  standard: { inhale: 1850, exhale: 1350 },
  fast: { inhale: 1350, exhale: 950 }
};

export const getBreathTiming = (totalMs: number) => {
  // Inhalación activa (~60%), exhalación pasiva/soltar (~40%)
  const inhale = totalMs * 0.60;
  return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
};

export const useBreathingTimer = () => {
  const { config } = useSettings();
  const {
    phase, setPhase,
    currentRound,
    setCurrentBreath,
    setRetentionTime,
    isPlaying,
    isPaused,
    setBreathSubPhase
  } = useSession();

  const breathRef = useRef(0);
  const breathStartTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const currentSubPhaseRef = useRef<'inhale' | 'exhale' | 'idle'>('idle');

  const getTimings = useCallback(() => {
    if (config.speed === 'custom') {
      return getBreathTiming(config.customTime * 1000);
    }
    return speedSettings[config.speed] || speedSettings.standard;
  }, [config.speed, config.customTime]);

  const stopLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Reset internal breath counters whenever leaving breathing phase, stopping, or starting a new round
  useEffect(() => {
    if (!isPlaying || phase !== 'breathing') {
      breathRef.current = 0;
      accumulatedMsRef.current = 0;
      breathStartTimeRef.current = null;
      currentSubPhaseRef.current = 'idle';
      setBreathSubPhase('idle');
    }
  }, [isPlaying, phase, currentRound, setBreathSubPhase]);

  useEffect(() => {
    if (!isPlaying || phase !== 'breathing') {
      stopLoop();
      return;
    }

    if (isPaused) {
      if (breathStartTimeRef.current !== null) {
        accumulatedMsRef.current += performance.now() - breathStartTimeRef.current;
        breathStartTimeRef.current = null;
      }
      stopLoop();
      return;
    }

    const timings = getTimings();
    const totalBreathMs = timings.inhale + timings.exhale;

    if (breathStartTimeRef.current === null) {
      breathStartTimeRef.current = performance.now();
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

      const now = performance.now();
      const elapsed = accumulatedMsRef.current + (now - breathStartTimeRef.current);

      if (elapsed < timings.inhale) {
        if (currentSubPhaseRef.current !== 'inhale') {
          currentSubPhaseRef.current = 'inhale';
          setBreathSubPhase('inhale');
          playInhaleCue(config.volume, timings.inhale);
        }
      } else if (elapsed < totalBreathMs) {
        if (currentSubPhaseRef.current !== 'exhale') {
          currentSubPhaseRef.current = 'exhale';
          setBreathSubPhase('exhale');
          playExhaleCue(config.volume, timings.exhale);
        }
      } else {
        accumulatedMsRef.current = 0;
        breathStartTimeRef.current = performance.now();

        if (breathRef.current >= config.breaths) {
          stopLoop();
          breathRef.current = 0;
          accumulatedMsRef.current = 0;
          breathStartTimeRef.current = null;
          currentSubPhaseRef.current = 'idle';
          setBreathSubPhase('idle');
          setRetentionTime(0);
          setPhase('retention');
          playLastBreathCue(config.volume);
          return;
        } else {
          breathRef.current += 1;
          setCurrentBreath(breathRef.current);
          currentSubPhaseRef.current = 'inhale';
          setBreathSubPhase('inhale');
          playInhaleCue(config.volume, timings.inhale);
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
    currentRound,
    config.breaths,
    config.volume,
    getTimings,
    setCurrentBreath,
    setBreathSubPhase,
    setPhase,
    setRetentionTime,
    stopLoop
  ]);

  return { getTimings };
};
