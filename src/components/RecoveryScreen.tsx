import React, { useEffect, useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { playTone, vibrate } from '../hooks/useBreathingTimer';

export const RecoveryScreen = () => {
  const { config } = useSettings();
  const { currentRound, setCurrentRound, phase, setPhase, recoverySubPhase, setRecoverySubPhase, setCurrentBreath } = useSession();
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(3);

  // Initialize the sub-phase when entering recovery
  useEffect(() => {
    if (phase !== 'recovery') return;

    setRecoverySubPhase('inhaling');
    setTimeLeft(3);
    playTone(220, 200, config.volume);
    vibrate(30);
  }, [phase, setRecoverySubPhase, config.volume]);

  // Main countdown timer loop
  useEffect(() => {
    if (phase !== 'recovery') return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Handle transitions when timeLeft reaches 0
  useEffect(() => {
    if (phase !== 'recovery') return;

    if (timeLeft === 0) {
      if (recoverySubPhase === 'inhaling') {
        setRecoverySubPhase('holding');
        setTimeLeft(15);
      } else if (recoverySubPhase === 'holding') {
        setRecoverySubPhase('exhaling');
        setTimeLeft(3);
        playTone(220, 200, config.volume);
        vibrate(30);
      } else if (recoverySubPhase === 'exhaling') {
        setRecoverySubPhase('idle');
        if (currentRound >= config.rounds) {
          setPhase('finished');
        } else {
          setCurrentRound((r) => r + 1);
          setCurrentBreath(0);
          setPhase('breathing');
        }
      }
    }
  }, [
    timeLeft,
    phase,
    recoverySubPhase,
    currentRound,
    config.rounds,
    config.volume,
    setPhase,
    setCurrentRound,
    setRecoverySubPhase,
    setCurrentBreath
  ]);

  if (phase !== 'recovery') return null;

  const showSubtitle = recoverySubPhase === 'inhaling' || recoverySubPhase === 'exhaling';
  const subtitleText = recoverySubPhase === 'inhaling' ? t('timeToInhale') : t('timeToExhale');

  const getInstructionText = () => {
    if (recoverySubPhase === 'inhaling') return t('inhaleInstruction');
    if (recoverySubPhase === 'holding') return t('holdAirInstruction');
    if (recoverySubPhase === 'exhaling') return t('releaseAirInstruction');
    return '';
  };

  const getHexagonStyle = () => {
    let scale = 1.0;
    let duration = 300;

    if (recoverySubPhase === 'inhaling') {
      scale = 1.3;
      duration = 3000;
    } else if (recoverySubPhase === 'holding') {
      scale = 1.3;
      duration = 0;
    } else if (recoverySubPhase === 'exhaling') {
      scale = 1.0;
      duration = 3000;
    }

    return {
      transform: `scale(${scale})`,
      transition: `transform ${duration}ms ease-in-out`
    };
  };

  const handleSkip = () => {
    setRecoverySubPhase('idle');
    if (currentRound >= config.rounds) {
      setPhase('finished');
    } else {
      setCurrentRound((r) => r + 1);
      setCurrentBreath(0);
      setPhase('breathing');
    }
  };

  return (
    <div id="recoveryScreen" className="screen active">
      <div className="round-info">
        {t('roundInfo', { current: currentRound, total: config.rounds })}
      </div>
      <div className="instruction">{getInstructionText()}</div>
      {showSubtitle && <div className="recovery-subtitle" style={{ display: 'block' }}>{subtitleText}</div>}
      <div className="hexagon-container">
        <div 
          className="hexagon phase-recovery" 
          style={getHexagonStyle()}
        >
          <div className="breath-counter">{timeLeft}</div>
        </div>
      </div>
      <div className="exercise-footer">
        <button className="skip-button" onClick={handleSkip}>
          {t('skipRecoveryBtn')}
        </button>
      </div>
    </div>
  );
};

