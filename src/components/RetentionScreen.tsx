import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { BreathingSphere } from './BreathingSphere';
import { formatTimeDigital } from '../utils/timeFormat';
import { playRetentionMinuteCue, playTargetReachedCue, playPersonalBestCue } from '../services/zenAudioService';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

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
  const targetReachedRef = useRef(false);
  const pbReachedRef = useRef(false);
  const [isNewPb, setIsNewPb] = useState(false);
  const historicalBestRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef(0);

  useEffect(() => {
    let animFrame: number | null = null;

    if (phase === 'retention') {
      if (startTimeRef.current === null && accumulatedMsRef.current === 0) {
        lastBeepMinuteRef.current = 0;
        targetReachedRef.current = false;
        pbReachedRef.current = false;
        setIsNewPb(false);
        setRetentionTime(0);

        let best = 0;
        try {
          const store = JSON.parse(localStorage.getItem('omega_wimhof_store') || '{}');
          if (store.breathingHistory) {
            store.breathingHistory.forEach((s: any) => {
              if (Array.isArray(s.retentionTimes)) {
                best = Math.max(best, ...s.retentionTimes);
              } else if (s.totalRetentionTime) {
                best = Math.max(best, s.totalRetentionTime);
              }
            });
          }
        } catch (e) {}
        try {
          const legacy = JSON.parse(localStorage.getItem('bubbleBreathingHistory') || '[]');
          legacy.forEach((s: any) => {
            best = Math.max(best, s.retentionSeconds || 0);
          });
        } catch (e) {}
        historicalBestRef.current = best;
      }

      if (isPaused) {
        if (startTimeRef.current !== null) {
          accumulatedMsRef.current += Math.max(0, performance.now() - startTimeRef.current);
          startTimeRef.current = null;
        }
        return;
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now();
      }

      const tick = () => {
        if (startTimeRef.current === null) return;
        const totalMs = accumulatedMsRef.current + (performance.now() - startTimeRef.current);
        const totalSec = Math.floor(totalMs / 1000);
        setRetentionTime(totalSec);

        if (
          config.targetRetentionSec > 0 &&
          totalSec >= config.targetRetentionSec &&
          !targetReachedRef.current
        ) {
          targetReachedRef.current = true;
          playTargetReachedCue(config.volume);
        }

        if (
          historicalBestRef.current >= 30 &&
          totalSec > historicalBestRef.current &&
          !pbReachedRef.current
        ) {
          pbReachedRef.current = true;
          setIsNewPb(true);
          playPersonalBestCue(config.volume);
        }

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
      accumulatedMsRef.current = 0;
      targetReachedRef.current = false;
      pbReachedRef.current = false;
      setIsNewPb(false);
    }

    return () => {
      if (animFrame !== null) {
        cancelAnimationFrame(animFrame);
      }
    };
  }, [phase, isPaused, config.volume, config.targetRetentionSec, setRetentionTime]);

  if (phase !== 'retention') return null;

  const handleTransitionToRecovery = () => {
    const totalMs = startTimeRef.current !== null
      ? accumulatedMsRef.current + Math.max(0, performance.now() - startTimeRef.current)
      : accumulatedMsRef.current;
    const finalElapsed = Math.floor(totalMs / 1000);

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

      {isNewPb && (
        <div 
          className="pb-live-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            border: '1px solid #ffd700',
            color: '#ffd700',
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            margin: '0.2rem auto',
            boxShadow: '0 0 14px rgba(255, 215, 0, 0.4)'
          }}
        >
          <Trophy size={16} color="#ffd700" />
          <span>{t('newPersonalBest', { defaultValue: '¡NUEVO RÉCORD PERSONAL!' })}</span>
        </div>
      )}

      {config.targetRetentionSec > 0 && (
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 600,
          color: retentionTime >= config.targetRetentionSec ? 'var(--omega-warm-amber, #ff7a00)' : 'var(--color-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          marginBottom: '0.4rem'
        }}>
          {retentionTime >= config.targetRetentionSec
            ? `🎯 ${t('targetReachedNotice', { defaultValue: '¡Meta alcanzada! Sigue a tu ritmo' })}`
            : `${t('targetGoalLabel', { defaultValue: 'Meta' })}: ${config.targetRetentionSec}s`}
        </div>
      )}

      <BreathingSphere
        phase="retention"
        scale={isPaused ? 1.0 : 1.05}
        isPulsing={!isPaused}
        progress={config.targetRetentionSec > 0 ? Math.min(100, Math.round((retentionTime / config.targetRetentionSec) * 100)) : 0}
        durationMs={800}
        onClick={handleTransitionToRecovery}
        counter={formatTimeDigital(retentionTime)}
      />

      <div className="tap-instruction" style={{ fontSize: '0.85rem' }}>
        {t('tapInstruction', { defaultValue: 'Pulsa el hexágono cuando sientas la necesidad de respirar' })}
      </div>

      <div className="controls-panel" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <button 
          className="control-btn" 
          title={t('resetSessionLabel')}
          onClick={resetSession}
          aria-label={t('resetSessionLabel')}
        >
          <RotateCcw size={22} />
        </button>
        <button 
          className="control-btn primary-btn" 
          onClick={togglePause}
          title={isPaused ? t('resumeLabel') : t('pauseLabel')}
          aria-label={isPaused ? t('resumeLabel') : t('pauseLabel')}
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
