import React from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';

const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2500, exhale: 1500 },
  standard: { inhale: 2000, exhale: 1000 },
  fast: { inhale: 1300, exhale: 700 }
};

const getBreathTiming = (totalMs: number) => {
  // Wim Hof: ~65% inhalación (larga y activa), ~35% exhalación (corta y pasiva)
  const inhale = totalMs * 0.65;
  return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
};

export const ExerciseScreen = () => {
  const { config } = useSettings();
  const { currentRound, currentBreath, setPhase, phase, breathSubPhase, setRetentionTime } = useSession();
  const { t } = useTranslation();

  if (phase !== 'breathing') return null;

  const timings = config.speed === 'custom'
    ? getBreathTiming(config.customTime * 1000)
    : speedSettings[config.speed] || speedSettings.standard;

  let scale = 1.0;
  let duration = 300; // default transition duration
  let easing = 'ease-in-out';

  if (breathSubPhase === 'inhale') {
    scale = 1.3;
    duration = timings.inhale;
    easing = 'ease-out'; // smooth controlled expansion
  } else if (breathSubPhase === 'exhale') {
    scale = 0.9;
    duration = timings.exhale;
    easing = 'ease-in'; // rapid passive drop (elastic recoil)
  }

  const isLastBreath = currentBreath === config.breaths;

  const hexagonStyle = {
    transform: `scale(${scale})`,
    transition: `transform ${duration}ms ${easing}`
  };

  const hexagonClass = `hexagon phase-breathing${isLastBreath ? ' last-breath' : ''}`;

  return (
    <div id="exerciseScreen" className="screen active">
      <div className="round-info" id="roundInfo">
        {t('roundInfo', { current: currentRound, total: config.rounds === 11 ? '∞' : config.rounds })}
      </div>
      <div className="instruction" id="exerciseInstruction">
        {t('exerciseInstruction', { count: config.breaths })}
      </div>
      <div className="hexagon-container">
        <div 
          className={hexagonClass}
          id="exerciseHexagon"
          style={hexagonStyle}
        >
          <div className={`breath-counter${isLastBreath ? ' last-breath' : ''}`} id="breathCounter">{currentBreath}</div>
        </div>
      </div>
      <div id="exerciseFooter" className="exercise-footer">
        <button className="skip-button" onClick={() => { setRetentionTime(0); setPhase('retention'); }}>
          {t('skipToRetentionBtn')}
        </button>
      </div>
    </div>
  );
};

