import React, { useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useHistory } from '../contexts/HistoryContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { formatTime } from '../utils/timeFormat';
import { Flame, Trophy } from 'lucide-react';

export const ResultsScreen = () => {
  const { phase, resetSession, roundResults, sessionStartTime } = useSession();
  const { config } = useSettings();
  const { addSession, currentStreak, longestStreak } = useHistory();
  const { t } = useTranslation();
  const savedRef = useRef(false);
  const sessionDurationRef = useRef<number | null>(null);

  const totalRetentionTime = roundResults.reduce((acc, r) => acc + r.retentionTime, 0);
  const averageRetentionTime = roundResults.length > 0 
    ? Math.round(totalRetentionTime / roundResults.length) 
    : 0;

  if (phase === 'finished' && sessionDurationRef.current === null) {
    const measuredDuration = sessionStartTime ? Math.max(0, Math.round((Date.now() - sessionStartTime) / 1000)) : 0;
    sessionDurationRef.current = Math.max(measuredDuration, totalRetentionTime);
  }

  const totalSessionTime = sessionDurationRef.current ?? 0;

  useEffect(() => {
    if (phase === 'finished' && !savedRef.current) {
      addSession({
        retentionSeconds: totalRetentionTime,
        rounds: roundResults.length || config.rounds,
        speed: config.speed === 'custom' ? `custom-${config.customTime}` : config.speed
      });
      savedRef.current = true;
    }
  }, [phase, addSession, totalRetentionTime, roundResults.length, config.speed, config.customTime, config.rounds]);

  // Reset saved flag and cached session duration when session resets
  useEffect(() => {
    if (phase === 'idle') {
      savedRef.current = false;
      sessionDurationRef.current = null;
    }
  }, [phase]);

  if (phase !== 'finished') return null;

  return (
    <div id="resultsScreen" className="screen active">
      <div className="results-title">{t('resultsTitle')}</div>
      <div id="resultsContent" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
          {t('totalSessionLabel')}: <strong>{formatTime(totalSessionTime)}</strong>
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
          {t('totalRetentionLabel')}: <strong>{formatTime(totalRetentionTime)}</strong>
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          {t('averageRetentionLabel')}: <strong>{formatTime(averageRetentionTime)}</strong>
        </p>
        
        {roundResults.length > 0 && (
          <div style={{ margin: '1.5rem auto', maxWidth: '300px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
            {roundResults.map((r) => (
              <div key={r.round} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>{t('roundLabel', { round: r.round })}:</span>
                <strong>{formatTime(r.retentionTime)}</strong>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: '1rem', color: 'var(--color-primary)', margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Flame size={20} /> Streak: {currentStreak}
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Trophy size={18} /> Best: {longestStreak}
        </p>
      </div>
      <button className="start-button" onClick={resetSession}>{t('newSessionBtn')}</button>
    </div>
  );
};

