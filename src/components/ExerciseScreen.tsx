import React from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { BreathingSphere } from './BreathingSphere';
import { speedSettings, getBreathTiming } from '../hooks/useBreathingTimer';
import { RotateCcw, Play, Pause, SkipForward } from 'lucide-react';

export const ExerciseScreen = () => {
  const { config } = useSettings();
  const { 
    currentRound, 
    currentBreath, 
    setPhase, 
    phase, 
    breathSubPhase, 
    setRetentionTime,
    isPaused,
    togglePause,
    resetSession
  } = useSession();
  const { t } = useTranslation();

  if (phase !== 'breathing') return null;

  const timings = config.speed === 'custom'
    ? getBreathTiming(config.customTime * 1000)
    : speedSettings[config.speed] || speedSettings.standard;

  let scale = 1.0;
  let duration = 300;
  let easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  if (isPaused) {
    scale = breathSubPhase === 'inhale' ? 1.25 : 0.95;
    duration = 0;
  } else if (breathSubPhase === 'inhale') {
    scale = 1.35;
    duration = timings.inhale;
    easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
  } else if (breathSubPhase === 'exhale') {
    scale = 0.92;
    duration = timings.exhale;
    easing = 'cubic-bezier(0.4, 0, 0.6, 1)';
  }

  const isLastBreath = currentBreath === config.breaths;
  const progressPercent = Math.min(100, Math.max(0, (currentBreath / config.breaths) * 100));

  const handleSkipToRetention = () => {
    setRetentionTime(0);
    setPhase('retention');
  };

  const getSubPhaseInstruction = () => {
    if (isLastBreath) {
      return breathSubPhase === 'inhale' 
        ? t('lastBreathInhale', { defaultValue: '¡Última inhalación profunda!' })
        : t('lastBreathExhale', { defaultValue: 'Suelta todo y entra en apnea...' });
    }
    if (breathSubPhase === 'inhale') {
      return t('breatheIn', { defaultValue: 'Inhala profundamente' });
    }
    if (breathSubPhase === 'exhale') {
      return t('letGo', { defaultValue: 'Suelta sin forzar' });
    }
    return t('exerciseInstruction', { count: config.breaths });
  };

  return (
    <div id="exerciseScreen" className="screen active" style={{ justifyContent: 'space-evenly' }}>
      <div className="round-info" id="roundInfo">
        {t('roundInfo', { current: currentRound, total: config.rounds === 11 ? '∞' : config.rounds })}
      </div>

      <div 
        className="instruction" 
        id="exerciseInstruction"
        style={{ minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {getSubPhaseInstruction()}
      </div>

      <BreathingSphere
        phase="breathing"
        scale={scale}
        durationMs={duration}
        easing={easing}
        progress={progressPercent}
        isLastBreath={isLastBreath}
        counter={currentBreath}
        id="exerciseHexagon"
        onClick={togglePause}
      />

      <div className="controls-panel" style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
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
        <button 
          className="control-btn" 
          title={t('skipToRetentionBtn')}
          onClick={handleSkipToRetention}
          aria-label={t('skipToRetentionBtn')}
        >
          <SkipForward size={22} />
        </button>
      </div>

      <div id="exerciseFooter" className="exercise-footer">
        <button className="skip-button" onClick={handleSkipToRetention}>
          {t('skipToRetentionBtn')}
        </button>
      </div>
    </div>
  );
};
