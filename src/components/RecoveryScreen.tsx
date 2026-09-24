import React, { useEffect, useState, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { BreathingSphere } from './BreathingSphere';
import { playInhaleCue, playExhaleCue, playRecoveryCue } from '../services/zenAudioService';
import { Play, Pause, RotateCcw } from 'lucide-react';

const INHALE_DURATION_MS = 3000;
const HOLD_DURATION_MS = 15000;
const EXHALE_DURATION_MS = 3000;
const TOTAL_RECOVERY_MS = INHALE_DURATION_MS + HOLD_DURATION_MS + EXHALE_DURATION_MS;

export const RecoveryScreen = () => {
  const { config } = useSettings();
  const {
    currentRound,
    setCurrentRound,
    phase,
    setPhase,
    recoverySubPhase,
    setRecoverySubPhase,
    setCurrentBreath,
    isPaused,
    togglePause,
    resetSession
  } = useSession();
  const { t } = useTranslation();

  const [displayNumber, setDisplayNumber] = useState<number>(3);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const soundPlayedRef = useRef<{ inhale: boolean; hold: boolean; exhale: boolean }>({
    inhale: false,
    hold: false,
    exhale: false
  });

  const handleFinishRecovery = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setRecoverySubPhase('idle');
    if (currentRound >= config.rounds && config.rounds !== 11) {
      setPhase('finished');
    } else {
      setCurrentRound((r) => r + 1);
      setCurrentBreath(0);
      setPhase('breathing');
    }
  };

  useEffect(() => {
    if (phase !== 'recovery') {
      startTimeRef.current = null;
      accumulatedMsRef.current = 0;
      soundPlayedRef.current = { inhale: false, hold: false, exhale: false };
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      accumulatedMsRef.current = 0;
      soundPlayedRef.current = { inhale: false, hold: false, exhale: false };
      setRecoverySubPhase('inhaling');
      setDisplayNumber(3);
    }

    if (isPaused) {
      if (startTimeRef.current !== null) {
        accumulatedMsRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const tick = () => {
      if (startTimeRef.current === null) return;
      const now = Date.now();
      const elapsed = accumulatedMsRef.current + (now - startTimeRef.current);

      if (elapsed < INHALE_DURATION_MS) {
        // Phase 1: Inhaling (0 - 3s)
        if (!soundPlayedRef.current.inhale) {
          soundPlayedRef.current.inhale = true;
          playInhaleCue(config.volume, INHALE_DURATION_MS);
          setRecoverySubPhase('inhaling');
        }
        const remSec = Math.max(1, Math.ceil((INHALE_DURATION_MS - elapsed) / 1000));
        setDisplayNumber(remSec);
        setProgressPercent((elapsed / INHALE_DURATION_MS) * 100);
      } else if (elapsed < INHALE_DURATION_MS + HOLD_DURATION_MS) {
        // Phase 2: Holding breath (3s - 18s)
        const holdElapsed = elapsed - INHALE_DURATION_MS;
        if (!soundPlayedRef.current.hold) {
          soundPlayedRef.current.hold = true;
          playRecoveryCue(config.volume);
          setRecoverySubPhase('holding');
        }
        const remSec = Math.max(0, Math.ceil((HOLD_DURATION_MS - holdElapsed) / 1000));
        setDisplayNumber(remSec);
        setProgressPercent(((HOLD_DURATION_MS - holdElapsed) / HOLD_DURATION_MS) * 100);
      } else if (elapsed < TOTAL_RECOVERY_MS) {
        // Phase 3: Exhaling / Releasing (18s - 21s)
        const exhaleElapsed = elapsed - (INHALE_DURATION_MS + HOLD_DURATION_MS);
        if (!soundPlayedRef.current.exhale) {
          soundPlayedRef.current.exhale = true;
          playExhaleCue(config.volume, EXHALE_DURATION_MS);
          setRecoverySubPhase('exhaling');
        }
        const remSec = Math.max(1, Math.ceil((EXHALE_DURATION_MS - exhaleElapsed) / 1000));
        setDisplayNumber(remSec);
        setProgressPercent(0);
      } else {
        // Phase 4: Recovery cycle fully completed!
        handleFinishRecovery();
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [phase, isPaused, config.volume, setRecoverySubPhase]);

  if (phase !== 'recovery') return null;

  const getInstructionText = () => {
    if (recoverySubPhase === 'inhaling') return t('inhaleInstruction', { defaultValue: 'Inhala hondo y llena los pulmones' });
    if (recoverySubPhase === 'holding') return t('holdAirInstruction', { defaultValue: 'Mantén el aire durante 15 segundos' });
    if (recoverySubPhase === 'exhaling') return t('releaseAirInstruction', { defaultValue: 'Suelta todo el aire...' });
    return '';
  };

  let sphereScale = 1.0;
  let duration = 300;
  let easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  if (isPaused) {
    sphereScale = recoverySubPhase === 'holding' ? 1.35 : 1.1;
    duration = 0;
  } else if (recoverySubPhase === 'inhaling') {
    sphereScale = 1.35;
    duration = INHALE_DURATION_MS;
    easing = 'ease-out';
  } else if (recoverySubPhase === 'holding') {
    sphereScale = 1.35;
    duration = 0;
  } else if (recoverySubPhase === 'exhaling') {
    sphereScale = 0.95;
    duration = EXHALE_DURATION_MS;
    easing = 'ease-in';
  }

  return (
    <div id="recoveryScreen" className="screen active" style={{ justifyContent: 'space-evenly' }}>
      <div className="round-info">
        {t('roundInfo', { current: currentRound, total: config.rounds === 11 ? '∞' : config.rounds })}
      </div>

      <div 
        className="instruction" 
        style={{ color: 'var(--omega-success-green, #2ecc71)', minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {getInstructionText()}
      </div>

      {/* Wim Hof Rounded Hexagon Sphere */}
      <BreathingSphere
        phase="recovery"
        scale={sphereScale}
        durationMs={duration}
        easing={easing}
        progress={progressPercent}
        counter={displayNumber}
        isPulsing={recoverySubPhase === 'holding' && !isPaused}
      />

      {/* Control Dock: Reset, Play/Pause */}
      <div className="controls-panel" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <button 
          className="control-btn" 
          title="Reiniciar"
          onClick={resetSession}
          aria-label="Reiniciar sesión"
        >
          <RotateCcw size={22} />
        </button>
        <button 
          className="control-btn primary-btn" 
          onClick={togglePause}
          title={isPaused ? 'Reanudar' : 'Pausa'}
          aria-label={isPaused ? 'Reanudar' : 'Pausa'}
        >
          {isPaused ? <Play size={28} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
        </button>
      </div>

      <div className="exercise-footer">
        <button className="skip-button" onClick={handleFinishRecovery}>
          {t('skipRecoveryBtn', { defaultValue: 'Saltar Recuperación' })}
        </button>
      </div>
    </div>
  );
};
