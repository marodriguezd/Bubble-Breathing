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
    <div id="statsScreen" className="screen active stats-screen">
      <h2 className="stats-title">{t('statsTitle', { defaultValue: 'Your Statistics' })}</h2>
      
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-value primary">{currentStreak}</div>
          <div className="stats-label">{t('currentStreak', { defaultValue: 'Current Streak' })}</div>
        </div>
        <div className="stats-card">
          <div className="stats-value primary">{longestStreak}</div>
          <div className="stats-label">{t('bestStreak', { defaultValue: 'Best Streak' })}</div>
        </div>
        <div className="stats-card">
          <div className="stats-value small">{totalSessions}</div>
          <div className="stats-label">{t('totalSessions', { defaultValue: 'Total Sessions' })}</div>
        </div>
        <div className="stats-card">
          <div className="stats-value small">{averageRetention}s</div>
          <div className="stats-label">{t('averageRetention', { defaultValue: 'Avg Retention' })}</div>
        </div>
      </div>

      <div className="history-section">
        <h3 className="history-title">{t('recentSessions', { defaultValue: 'Recent Sessions' })}</h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--color-text)', textAlign: 'center', opacity: 0.7 }}>
            {t('noSessionsYet', { defaultValue: 'No sessions recorded yet.' })}
          </p>
        ) : (
          <div className="history-list">
            {history.slice(0, 10).map((session, idx) => {
              let statusIcon = '🧘';
              let statusDotColor = 'var(--color-primary)';
              if (session.retentionSeconds >= 60) {
                statusIcon = '⚡';
                statusDotColor = 'var(--color-success)';
              } else if (session.retentionSeconds >= 30) {
                statusIcon = '🌬️';
                statusDotColor = 'var(--color-secondary)';
              } else {
                statusIcon = '⏱️';
                statusDotColor = 'var(--color-accent)';
              }

              return (
                <div key={idx} className="history-item">
                  <div className="history-item-left">
                    <span className="history-status-dot" style={{ backgroundColor: statusDotColor, color: statusDotColor }}></span>
                    <span className="history-icon">{statusIcon}</span>
                    <span className="history-date">{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <strong className="history-detail">
                    {session.retentionSeconds}s ({session.rounds} {session.rounds === 1 ? t('roundSingular', { defaultValue: 'rnd' }) : t('roundsPlural', { defaultValue: 'rnds' })})
                  </strong>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button className="reset-config-btn back-btn" onClick={() => setPhase('idle')}>
        {t('backBtn', { defaultValue: 'Back' })}
      </button>
    </div>
  );
};
