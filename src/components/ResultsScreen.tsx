import React, { useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useHistory } from '../contexts/HistoryContext';
import { useSettings } from '../contexts/SettingsContext';

export const ResultsScreen = () => {
  const { phase, resetSession, retentionTime, currentRound } = useSession();
  const { config } = useSettings();
  const { addSession, currentStreak, longestStreak } = useHistory();
  const savedRef = useRef(false);

  useEffect(() => {
    if (phase === 'finished' && !savedRef.current) {
      addSession({
        retentionSeconds: retentionTime,
        rounds: currentRound,
        speed: config.speed === 'custom' ? `custom-${config.customTime}` : config.speed
      });
      savedRef.current = true;
    }
  }, [phase, addSession, retentionTime, currentRound, config.speed, config.customTime]);

  if (phase !== 'finished') return null;

  return (
    <div id="resultsScreen" className="screen active">
      <div className="results-title">Session Results</div>
      <div id="resultsContent" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>
          Total Retention Time: <strong>{retentionTime}s</strong>
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
          🔥 Current Streak: {currentStreak} days
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
          🏆 Longest Streak: {longestStreak} days
        </p>
      </div>
      <button className="start-button" onClick={resetSession}>New Session</button>
    </div>
  );
};
