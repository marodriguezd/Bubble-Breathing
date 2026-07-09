import React from 'react';
import { useSession } from '../contexts/SessionContext';
import { useHistory } from '../contexts/HistoryContext';
import { useTranslation } from '../hooks/useTranslation';

export const StatsScreen = () => {
  const { phase, setPhase } = useSession();
  const { history, currentStreak, longestStreak } = useHistory();
  const { t } = useTranslation();

  if (phase !== 'stats') return null;

  const totalSessions = history.length;
  const totalRetentionTime = history.reduce((acc, curr) => acc + curr.retentionSeconds, 0);
  const averageRetention = totalSessions > 0 ? Math.round(totalRetentionTime / totalSessions) : 0;

  return (
    <div id="statsScreen" className="screen active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '2rem' }}>{t('statsTitle', { defaultValue: 'Your Statistics' })}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{currentStreak}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('currentStreak', { defaultValue: 'Current Streak' })}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{longestStreak}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('bestStreak', { defaultValue: 'Best Streak' })}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#fff' }}>{totalSessions}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('totalSessions', { defaultValue: 'Total Sessions' })}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#fff' }}>{averageRetention}s</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('averageRetention', { defaultValue: 'Avg Retention' })}</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'left', marginBottom: '2rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>{t('recentSessions', { defaultValue: 'Recent Sessions' })}</h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--color-text)' }}>{t('noSessionsYet', { defaultValue: 'No sessions recorded yet.' })}</p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem' }}>
            {history.slice(0, 10).map((session, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < Math.min(history.length, 10) - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ color: 'var(--color-text)' }}>{new Date(session.date).toLocaleDateString()}</span>
                <strong style={{ color: '#fff' }}>{session.retentionSeconds}s ({session.rounds} rnds)</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="reset-config-btn" onClick={() => setPhase('idle')}>
        {t('backBtn', { defaultValue: 'Back' })}
      </button>
    </div>
  );
};
