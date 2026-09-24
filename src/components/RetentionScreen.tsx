import React, { useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { BreathingSphere } from './BreathingSphere';
import { playRetentionMinuteCue } from '../services/zenAudioService';
import { Square, Play, Pause, RotateCcw } from 'lucide-react';

export const RetentionScreen = () => {
  const { config } = useSettings();
  const { 
    currentRound, 
    phase, 
    setPhase, 
    retentionTime, 
    setRetentionTime, 
    setRoundResults,
    isPaused,
    togglePause,
    resetSession
  } = useSession();
  const { t } = useTranslation();

  const lastBeepMinuteRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedSecRef = useRef(0);

  useEffect(() => {
    let animFrame: number | null = null;

    if (phase === 'retention') {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        lastBeepMinuteRef.current = 0;
        accumulatedSecRef.current = 0;
        setRetentionTime(0);
      }

      if (isPaused) {
        // Paused: freeze timer
        if (startTimeRef.current !== null) {
          accumulatedSecRef.current += Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));
          startTimeRef.current = null;
        }
        return;
      }

      // Active unpaused retention
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      const tick = () => {
        if (startTimeRef.current === null) return;
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const totalSec = accumulatedSecRef.current + currentElapsed;
        setRetentionTime(totalSec);

        // Per-minute chime & subtle haptic feedback
        const currentMinute = Math.floor(totalSec / 60);
        if (currentMinute > 0 && totalSec % 60 === 0 && currentMinute > lastBeepMinuteRef.current) {
          lastBeepMinuteRef.current = currentMinute;
          playRetentionMinuteCue(config.volume, currentMinute);
        }

        animFrame = requestAnimationFrame(tick);
      };

      animFrame = requestAnimationFrame(tick);
    } else {
      startTimeRef.current = null;
      accumulatedSecRef.current = 0;
    }

    return () => {
      if (animFrame !== null) {
        cancelAnimationFrame(animFrame);
      }
    };
  }, [phase, isPaused, config.volume, setRetentionTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (phase !== 'retention') return null;

  const handleTransitionToRecovery = () => {
    const finalElapsed = startTimeRef.current !== null
      ? accumulatedSecRef.current + Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000))
      : retentionTime;

    setRoundResults((prev) => {
      if (prev.some(r => r.round === currentRound)) {
        return prev;
      }
      return [...prev, { round: currentRound, retentionTime: finalElapsed }];
    });
    setPhase('recovery');
  };

  return (
    <div id="retentionScreen" className="screen active" style={{ justifyContent: 'space-evenly' }}>
      <div className="round-info">
        {t('roundInfo', { current: currentRound, total: config.rounds === 11 ? '∞' : config.rounds })}
      </div>

      <div className="instruction" style={{ color: 'var(--omega-primary-cyan, #00f0ff)' }}>
        {t('retentionInstruction', { defaultValue: 'Apnea: Relájate y aguanta sin aire' })}
      </div>

      <div className="retention-timer" style={{ margin: '0.5rem 0' }}>
        {formatTime(retentionTime)}
      </div>

      {/* Wim Hof Rounded Hexagon Sphere */}
      <BreathingSphere
        phase="retention"
        scale={isPaused ? 1.0 : 1.05}
        isPulsing={!isPaused}
        durationMs={800}
        onClick={handleTransitionToRecovery}
        icon={<Square size={44} fill="currentColor" />}
      />

      <div className="tap-instruction" style={{ fontSize: '0.85rem' }}>
        {t('tapInstruction', { defaultValue: 'Pulsa el hexágono cuando sientas la necesidad de respirar' })}
      </div>

      {/* Control Dock: Reset, Play/Pause, Finish Retention */}
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
        <button className="skip-button" onClick={handleTransitionToRecovery}>
          {t('inhaleAndRecoverBtn', { defaultValue: 'Inhalar y Recuperar' })}
        </button>
      </div>
    </div>
  );
};
