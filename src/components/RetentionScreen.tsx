import React, { useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';

export const RetentionScreen = () => {
  const { config } = useSettings();
  const { currentRound, phase, setPhase, retentionTime, setRetentionTime } = useSession();

  useEffect(() => {
    let interval: number | null = null;
    if (phase === 'retention') {
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

  return (
    <div id="retentionScreen" className="screen active">
      <div className="round-info">Round {currentRound} / {config.rounds}</div>
      <div className="instruction">Hold your breath</div>
      <div className="retention-timer">{formatTime(retentionTime)}</div>
      <div className="hexagon-container">
        <div 
          className="hexagon phase-retention" 
          onClick={() => setPhase('recovery')}
          style={{ cursor: 'pointer' }}
        >
          <div className="breath-counter">■</div>
        </div>
      </div>
      <div className="tap-instruction">
        Tap when you need to breathe
      </div>
    </div>
  );
};
