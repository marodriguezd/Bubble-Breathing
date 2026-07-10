import React, { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' }
];

export const Header = () => {
  const { config, updateConfig } = useSettings();
  const { phase, setPhase, currentRound, currentBreath, recoverySubPhase, setIsPlaying } = useSession();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentLangObj = LANGUAGES.find(l => l.code === config.language) || LANGUAGES[0];

  const toggleTheme = () => {
    const nextTheme = config.theme === 'dark' ? 'light' : 'dark';
    updateConfig({ theme: nextTheme });
  };

  let progressWidth = 0;
  if (phase !== 'idle' && phase !== 'finished') {
    const totalSteps = config.rounds * (config.breaths + 2);
    let currentStep = (currentRound - 1) * (config.breaths + 2);

    if (phase === 'breathing') {
      currentStep += currentBreath;
    } else if (phase === 'retention') {
      currentStep += config.breaths + 1;
    } else if (phase === 'recovery') {
      if (recoverySubPhase === 'inhaling') {
        currentStep += config.breaths + 1.25;
      } else if (recoverySubPhase === 'holding') {
        currentStep += config.breaths + 1.5;
      } else if (recoverySubPhase === 'exhaling') {
        currentStep += config.breaths + 1.75;
      } else {
        currentStep += config.breaths + 1.5;
      }
    }
    progressWidth = Math.min(100, (currentStep / totalSteps) * 100);
  } else if (phase === 'finished') {
    progressWidth = 100;
  }

  return (
    <div className="header">
      <div className="lang-container">
        {isDropdownOpen && (
          <div 
            className="lang-overlay" 
            id="langOverlay" 
            style={{ display: 'block' }}
            onClick={() => setIsDropdownOpen(false)}
          ></div>
        )}
        <div className="lang-selector">
          <button 
            className="lang-toggle" 
            id="langToggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="lang-flag" id="langFlag">{currentLangObj.flag}</span>
            <span id="langCode">{currentLangObj.code.toUpperCase()}</span>
          </button>
          <div 
            className={`lang-dropdown ${isDropdownOpen ? 'open' : ''}`}
            id="langDropdown" 
          >
            {LANGUAGES.map((lang) => (
              <button 
                key={lang.code}
                className="lang-option" 
                onClick={() => {
                  updateConfig({ language: lang.code });
                  setIsDropdownOpen(false);
                }}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <h1 id="headerTitle">{t('appTitle')}</h1>
      <div id="progressBar">
        <div id="progressFill" style={{ width: `${progressWidth}%` }}></div>
      </div>
      <button 
        className={`theme-toggle-btn ${(phase !== 'idle' && phase !== 'stats') ? 'hidden' : ''}`} 
        id="themeToggleBtn" 
        title="Change theme"
        onClick={toggleTheme}
      >
        {config.theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <button 
        className={`finish-btn ${(phase === 'idle' || phase === 'finished' || phase === 'stats') ? 'hidden' : ''}`} 
        id="finishBtn"
        onClick={() => {
          setIsPlaying(false);
          setPhase('finished');
        }}
      >
        {t('finishBtn')}
      </button>
    </div>
  );
};

