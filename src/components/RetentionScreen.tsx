import React, { useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';

export const RetentionScreen = () => {
  const { config } = useSettings();
  const { currentRound, phase, setPhase, retentionTime, setRetentionTime, setRoundResults } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    let interval: number | null = null;
    if (phase === 'retention') {
      setRetentionTime(0);
      interval = window.setInterval(() => {
        setRetentionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, setRetentionTime]);


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
        {t('roundInfo', { current: currentRound, total: config.rounds })}
      </div>
      <div className="instruction">{t('retentionInstruction')}</div>
      <div className="retention-timer">{formatTime(retentionTime)}</div>
      <div className="hexagon-container">
        <div 
          className="hexagon phase-retention" 
          onClick={handleTransitionToRecovery}
          style={{ cursor: 'pointer' }}
        >
          <div className="breath-counter">■</div>
        </div>
      </div>
      <div className="tap-instruction">
        {t('tapInstruction')}
      </div>
    </div>
  );
};

