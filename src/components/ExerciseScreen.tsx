import React from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';

export const ExerciseScreen = () => {
  const { config } = useSettings();
  const { currentRound, currentBreath, setPhase, phase } = useSession();

  if (phase !== 'breathing') return null;

  return (
    <div id="exerciseScreen" className="screen active">
      <div className="round-info" id="roundInfo">Round {currentRound} / {config.rounds}</div>
      <div className="instruction" id="exerciseInstruction">
        Take {config.breaths} deep breaths
      </div>
      <div className="hexagon-container">
        <div className="hexagon phase-breathing" id="exerciseHexagon">
          <div className="breath-counter" id="breathCounter">{currentBreath}</div>
        </div>
      </div>
      <div id="exerciseFooter" className="exercise-footer">
        <button className="skip-button" onClick={() => setPhase('retention')}>
          Skip to breath hold
        </button>
      </div>
    </div>
  );
};
