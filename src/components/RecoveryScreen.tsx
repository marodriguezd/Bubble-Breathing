import React, { useEffect, useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';

export const RecoveryScreen = () => {
  const { config } = useSettings();
  const { currentRound, setCurrentRound, phase, setPhase } = useSession();
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    let interval: number | null = null;
    if (phase === 'recovery') {
      setTimeLeft(15);
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // End of recovery
            if (currentRound >= config.rounds) {
              setPhase('finished');
            } else {
              setCurrentRound(currentRound + 1);
              setPhase('breathing');
            }
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, currentRound, config.rounds, setPhase, setCurrentRound]);

  if (phase !== 'recovery') return null;

  return (
    <div id="recoveryScreen" className="screen active">
      <div className="round-info">Round {currentRound} / {config.rounds}</div>
      <div className="instruction">Recovery breath</div>
      <div className="retention-timer">{timeLeft}s</div>
      <div className="hexagon-container">
        <div className="hexagon phase-recovery">
          <div className="breath-counter">Hold</div>
        </div>
      </div>
      <div className="exercise-footer">
        <button className="skip-button" onClick={() => {
          if (currentRound >= config.rounds) {
            setPhase('finished');
          } else {
            setCurrentRound(currentRound + 1);
            setPhase('breathing');
          }
        }}>
          Skip recovery
        </button>
      </div>
    </div>
  );
};
