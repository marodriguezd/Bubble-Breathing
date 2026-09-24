import React from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { BreathingSphere } from './BreathingSphere';
import { RotateCcw, Play, Pause, SkipForward } from 'lucide-react';

const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2500, exhale: 1500 },
  standard: { inhale: 2000, exhale: 1000 },
  fast: { inhale: 1300, exhale: 700 }
};

const getBreathTiming = (totalMs: number) => {
  const inhale = totalMs * 0.65;
  return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
};

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
        : t('lastBreathExhale', { defaultValue: 'Suelta todo y aguanta...' });
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
      {/* Round Information */}
      <div className="round-info" id="roundInfo">
        {t('roundInfo', { current: currentRound, total: config.rounds === 11 ? '∞' : config.rounds })}
      </div>

      {/* Dynamic Breath Instruction */}
      <div 
        className="instruction" 
        id="exerciseInstruction"
        style={{ minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {getSubPhaseInstruction()}
      </div>

      {/* Wim Hof Sacred Geometry Rounded Hexagon */}
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

      {/* Control Dock: Reset, Play/Pause, Skip */}
      <div className="controls-panel" style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <button 
          className="control-btn" 
          title="Reiniciar"
          onClick={resetSession}
          aria-label="Reiniciar sesión"
        >
          <RotateCcw size={22} />
        </button>
        <button 
          className="control-btn primary-btn" 
          onClick={togglePause}
          title={isPaused ? 'Reanudar' : 'Pausa'}
          aria-label={isPaused ? 'Reanudar' : 'Pausa'}
        >
          {isPaused ? <Play size={28} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
        </button>
        <button 
          className="control-btn" 
          title="Saltar a retención"
          onClick={handleSkipToRetention}
          aria-label="Saltar a retención"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Skip Button Footer */}
      <div id="exerciseFooter" className="exercise-footer">
        <button className="skip-button" onClick={handleSkipToRetention}>
          {t('skipToRetentionBtn')}
        </button>
      </div>
    </div>
  );
};
