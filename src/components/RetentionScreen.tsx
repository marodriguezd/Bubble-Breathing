import React, { useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { Square } from 'lucide-react';
import { playTone, vibrate } from '../hooks/useBreathingTimer';

export const RetentionScreen = () => {
  const { config } = useSettings();
  const { currentRound, phase, setPhase, retentionTime, setRetentionTime, setRoundResults } = useSession();
  const { t } = useTranslation();
  const lastBeepMinuteRef = useRef(0);

  useEffect(() => {
    let interval: number | null = null;
    if (phase === 'retention') {
      setRetentionTime(0);
      lastBeepMinuteRef.current = 0;
      interval = window.setInterval(() => {
        setRetentionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, setRetentionTime]);

  // Per-minute feedback during apnea: subtle beep + light double-tap vibration
  // so the user can count elapsed minutes by ear without watching the timer.
  // Distinct from the last-breath feedback (which is lower pitch and louder).
  // - Sound is gated by playTone() itself when volume === 0.
  // - Vibration is ALWAYS requested here: navigator.vibrate() is filtered by the
  //   device's system mode (silent → blocked by the OS, vibrate/sound → passes),
  //   so we should not gate it on the app's in-app volume slider.
  useEffect(() => {
    if (phase === 'retention' && retentionTime > 0) {
      const currentMinute = Math.floor(retentionTime / 60);
      if (currentMinute > 0 && retentionTime % 60 === 0 && currentMinute > lastBeepMinuteRef.current) {
        lastBeepMinuteRef.current = currentMinute;
        playTone(180, 350, config.volume * 0.75);
        vibrate([100, 50, 100]);
      }
    }
  }, [phase, retentionTime, config.volume]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (phase !== 'retention') return null;

  const handleTransitionToRecovery = () => {
    setRoundResults((prev) => {
      // Avoid duplicates for the same round
      if (prev.some(r => r.round === currentRound)) {
        return prev;
      }
      return [...prev, { round: currentRound, retentionTime }];
    });
    setPhase('recovery');
  };

  return (
    <div id="retentionScreen" className="screen active">
      <div className="round-info">
        {t('roundInfo', { current: currentRound, total: config.rounds === 11 ? '∞' : config.rounds })}
      </div>
      <div className="instruction">{t('retentionInstruction')}</div>
      <div className="retention-timer">{formatTime(retentionTime)}</div>
      <div className="hexagon-container">
        <div 
          className="hexagon phase-retention" 
          onClick={handleTransitionToRecovery}
          style={{ cursor: 'pointer' }}
        >
          <div className="breath-counter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Square size={48} fill="currentColor" /></div>
        </div>
      </div>
      <div className="tap-instruction">
        {t('tapInstruction')}
      </div>
    </div>
  );
};

