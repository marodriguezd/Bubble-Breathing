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
  slow: { inhale: 1000, exhale: 3000 },
  standard: { inhale: 800, exhale: 2200 },
  fast: { inhale: 500, exhale: 1500 }
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
  const breathRef = useRef(0);

  const getBreathTiming = useCallback((totalMs: number) => {
    let inhale;
    if (totalMs <= 2500) {
      inhale = totalMs * (0.4 / 2.5);
    } else if (totalMs <= 6000) {
      const fraction = (totalMs - 2500) / (6000 - 2500);
      inhale = 400 + fraction * (2000 - 400); 
    } else {
      inhale = 2000;
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

  const runBreathingCycle = useCallback((isFirstCycle = false) => {
    if (!isPlaying || phase !== 'breathing') return;

    const timings = getTimings();
    
    // Increment breath at start of cycle
    breathRef.current += 1;
    const isLastBreath = breathRef.current === config.breaths;

    if (breathRef.current > config.breaths) {
      // Switch to retention
      setPhase('retention');
      setBreathSubPhase('idle');
      return;
    }

    // Update the state outside the state updater function
    setCurrentBreath(breathRef.current);

    const startInhale = () => {
      // Inhale starts
      setBreathSubPhase('inhale');

      if (isLastBreath) {
        // Last breath before apnea — strongly amplified feedback
        const boostedVolume = Math.min(1, config.volume * 2.5);
        playTone(150, 600, boostedVolume);
        vibrate([150, 60, 150, 60, 200]);
      } else {
        playTone(220, 200, config.volume);
        vibrate(30);
      }

      // Schedule Exhale
      phaseTimerRef.current = window.setTimeout(() => {
        setBreathSubPhase('exhale');

        // For the last breath, also amplify exhalation feedback
        if (isLastBreath) {
          const boostedVolume = Math.min(1, config.volume * 2.5);
          playTone(120, 800, boostedVolume);
          vibrate([120, 50, 120]);
        }

        // Schedule next breathing cycle
        phaseTimerRef.current = window.setTimeout(() => {
          runBreathingCycle();
        }, timings.exhale);

      }, timings.inhale);
    };

    if (isFirstCycle) {
      // Ensure the component renders at idle/scale-1.0 first so the
      // CSS transition from 1.0 → 1.3 actually fires on the first inhale.
      setBreathSubPhase('idle');
      requestAnimationFrame(() => requestAnimationFrame(startInhale));
    } else {
      startInhale();
    }
  }, [isPlaying, phase, config.breaths, config.volume, getTimings, setCurrentBreath, setPhase, setBreathSubPhase]);

  useEffect(() => {
    if (isPlaying && phase === 'breathing') {
      breathRef.current = 0;
      runBreathingCycle(true);
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
    breathRef.current = 0;
    setIsPlaying(true);
    setCurrentRound(1);
    setCurrentBreath(0);
    setPhase('breathing');
  };

  const stopSession = () => {
    breathRef.current = 0;
    setIsPlaying(false);
    setBreathSubPhase('idle');
    stopTimer();
  };

  return { startSession, stopSession, getTimings };
};

