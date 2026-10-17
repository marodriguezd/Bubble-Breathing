import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useHistory } from '../contexts/HistoryContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { formatTime } from '../utils/timeFormat';
import { Flame, Trophy, Sparkles } from 'lucide-react';
import { RoundRetentionBarChart } from '../../../src/components/RoundRetentionBarChart';

const SENSATION_OPTIONS = [
  { id: 'tingling', labelKey: 'sensation_tingling', defaultLabel: 'Hormigueo', icon: '✨' },
  { id: 'lightheaded', labelKey: 'sensation_lightheaded', defaultLabel: 'Cabeza ligera', icon: '☁️' },
  { id: 'calm', labelKey: 'sensation_calm', defaultLabel: 'Paz profunda', icon: '🧘' },
  { id: 'heat', labelKey: 'sensation_heat', defaultLabel: 'Calor interno', icon: '🔥' },
  { id: 'euphoria', labelKey: 'sensation_euphoria', defaultLabel: 'Euforia', icon: '⚡' }
];

export const ResultsScreen = () => {
  const { phase, resetSession, roundResults, sessionStartTime } = useSession();
  const { config } = useSettings();
  const { addSession, updateSession, currentStreak, longestStreak } = useHistory();
  const { t } = useTranslation();
  const savedRef = useRef(false);
  const savedIdRef = useRef<string | null>(null);
  const sessionDurationRef = useRef<number | null>(null);
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);

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
      const id = addSession({
        retentionSeconds: totalRetentionTime,
        retentionTimes: roundResults.map(r => r.retentionTime),
        rounds: roundResults.length || config.rounds,
        speed: config.speed === 'custom' ? `custom-${config.customTime}` : config.speed,
        sensations: selectedSensations
      });
      savedIdRef.current = id;
      savedRef.current = true;
    }
  }, [phase, addSession, totalRetentionTime, roundResults, config.speed, config.customTime, config.rounds]);

  // Reset saved flag and cached session duration when session resets
  useEffect(() => {
    if (phase === 'idle') {
      savedRef.current = false;
      savedIdRef.current = null;
      sessionDurationRef.current = null;
      setSelectedSensations([]);
    }
  }, [phase]);

  const toggleSensation = (id: string) => {
    const next = selectedSensations.includes(id)
      ? selectedSensations.filter(s => s !== id)
      : [...selectedSensations, id];
    setSelectedSensations(next);

    if (savedIdRef.current) {
      updateSession(savedIdRef.current, { sensations: next });
      try {
        const storeStr = localStorage.getItem('omega_wimhof_store');
        if (storeStr) {
          const store = JSON.parse(storeStr);
          if (store.breathingHistory && store.breathingHistory[0]) {
            store.breathingHistory[0].sensations = next;
            localStorage.setItem('omega_wimhof_store', JSON.stringify(store));
            window.dispatchEvent(new CustomEvent('omega-store-update'));
          }
        }
      } catch (e) {}
    }
  };

  if (phase !== 'finished') return null;

  return (
    <div id="resultsScreen" className="screen active">
      <div className="results-title">{t('resultsTitle')}</div>
      <div id="resultsContent" style={{ marginBottom: '1.2rem', textAlign: 'center', width: '100%' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#fff' }}>
          {t('totalSessionLabel')}: <strong>{formatTime(totalSessionTime)}</strong>
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'rgba(255, 255, 255, 0.9)' }}>
          {t('totalRetentionLabel')}: <strong>{formatTime(totalRetentionTime)}</strong>
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          {t('averageRetentionLabel')}: <strong>{formatTime(averageRetentionTime)}</strong>
        </p>
        
        {roundResults.length > 0 && (
          <div style={{ margin: '1rem auto', maxWidth: '340px' }}>
            <RoundRetentionBarChart
              retentionTimes={roundResults.map(r => r.retentionTime)}
              compact={false}
              langDict={{
                retentionGraphTitle: t('retentionGraphTitle', { defaultValue: 'Apnea por Ronda' }),
                avgRetentionLabel: t('averageRetentionLabel', { defaultValue: 'Promedio' }),
                roundLabel: t('roundSingular', { defaultValue: 'Ronda' })
              }}
            />
          </div>
        )}

        {/* Bodily Sensation Check-in Chips */}
        <div style={{
          margin: '1.2rem auto',
          maxWidth: '360px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          border: '1px solid var(--color-glass-border)',
          padding: '0.8rem 0.9rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--omega-primary-cyan, #00f0ff)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <Sparkles size={16} />
            <span>{t('sensationTitle', { defaultValue: 'Sensaciones corporales (opcional)' })}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center' }}>
            {SENSATION_OPTIONS.map((opt) => {
              const active = selectedSensations.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleSensation(opt.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: active ? 'rgba(0, 240, 255, 0.22)' : 'rgba(255, 255, 255, 0.06)',
                    border: active ? '1px solid var(--omega-primary-cyan, #00f0ff)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: active ? '#00f0ff' : 'var(--color-muted)',
                    borderRadius: '9999px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{opt.icon}</span>
                  <span>{t(opt.labelKey, { defaultValue: opt.defaultLabel })}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: '0.4rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Flame size={18} /> Streak: {currentStreak}
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', margin: '0.4rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Trophy size={16} /> Best: {longestStreak}
        </p>
      </div>
      <button className="start-button" onClick={resetSession}>{t('newSessionBtn')}</button>
    </div>
  );
};

