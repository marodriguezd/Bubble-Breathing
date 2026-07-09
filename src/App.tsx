import { useEffect, useRef } from 'react';
import './style.css';

// Legacy logic imports
import './translations.js';
// @ts-ignore
import { initApp } from './script.js';

function App() {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initApp();
      initialized.current = true;
    }
  }, []);

  return (
    <div className="container">
    <div className="header">
      <div className="lang-container">
        <div className="lang-selector">
          <button className="lang-toggle" id="langToggle">
            <span className="lang-flag" id="langFlag">🇬🇧</span>
            <span id="langCode">EN</span>
          </button>
          <div className="lang-dropdown" id="langDropdown">
            <button className="lang-option" data-lang="en">
              <span className="lang-flag">🇬🇧</span>
              <span>English</span>
            </button>
            <button className="lang-option" data-lang="es">
              <span className="lang-flag">🇪🇸</span>
              <span>Español</span>
            </button>
            <button className="lang-option" data-lang="fr">
              <span className="lang-flag">🇫🇷</span>
              <span>Français</span>
            </button>
            <button className="lang-option" data-lang="it">
              <span className="lang-flag">🇮🇹</span>
              <span>Italiano</span>
            </button>
            <button className="lang-option" data-lang="de">
              <span className="lang-flag">🇩🇪</span>
              <span>Deutsch</span>
            </button>
            <button className="lang-option" data-lang="pt">
              <span className="lang-flag">🇵🇹</span>
              <span>Português</span>
            </button>
            <button className="lang-option" data-lang="zh">
              <span className="lang-flag">🇨🇳</span>
              <span>简体中文</span>
            </button>
          </div>
        </div>
        <div className="lang-overlay" id="langOverlay"></div>
      </div>
      <h1 id="headerTitle">Bubble Breathing</h1>
      <div id="progressBar">
        <div id="progressFill"></div>
      </div>
      {/* ADDED THEME BUTTON */}
      <button className="theme-toggle-btn" id="themeToggleBtn" title="Change theme">🌙</button>
      <button className="finish-btn hidden" id="finishBtn">Finish</button>
    </div>

    {/* CONFIGURATION SCREEN */}
    <div id="configScreen" className="screen active">
      <div className="hexagon-container">
        <div className="hexagon phase-breathing" id="previewHexagon">
          <div className="breath-counter" id="previewCounter">1</div>
        </div>
      </div>
      <div className="preview-label" id="previewLabel">Breathing Preview</div>
      <div className="speed-selector">
        <button className="speed-btn" data-speed="slow" id="speedSlow">
          Slow
        </button>
        <button className="speed-btn active" data-speed="standard" id="speedStandard">
          Standard
        </button>
        <button className="speed-btn hidden-mode" data-speed="mid-fast" id="speedMidFast">
          Mid-Fast
        </button>
        <button className="speed-btn" data-speed="fast" id="speedFast">
          Fast
        </button>
      </div>
      <div className="slider-group">
        <label htmlFor="roundsSlider">
          <span className="slider-label" id="roundsLabel">Rounds:</span>
          <span id="roundsValue">3</span>
        </label>
        <input type="range" id="roundsSlider" min="1" max="11" value="3" className="slider" />
      </div>
      <div className="slider-group">
        <label htmlFor="breathsSlider">
          <span className="slider-label" id="breathsLabel">Breaths:</span>
          <span id="breathsValue">30</span>
        </label>
        <input type="range" id="breathsSlider" min="5" max="60" step="5" value="30" className="slider" />
      </div>
      <div className="slider-group">
        <label htmlFor="volumeSlider">
          <span className="slider-label" id="volumeLabel">Volume:</span>
          <span id="volumeValue">50</span>%
        </label>
        <input type="range" id="volumeSlider" min="0" max="100" step="5" value="50" className="slider" />
      </div>
      <div className="estimated-time">
        <span data-translate="estimated_time">Estimated time</span>: <span id="estimated-time"></span>
      </div>
      <div className="config-buttons">
        <button className="reset-config-btn" id="resetConfigBtn">Reset</button>
        <button className="start-button" id="startButton">Start</button>
      </div>
    </div>

    {/* EXERCISE AND RETENTION SCREEN */}
    <div id="exerciseScreen" className="screen">
      <div className="round-info" id="roundInfo">Round 1 / 3</div>
      <div className="instruction" id="exerciseInstruction">
        Take 30 deep breaths
      </div>
      <div className="hexagon-container">
        <div className="hexagon phase-breathing" id="exerciseHexagon">
          <div className="breath-counter" id="breathCounter">1</div>
        </div>
      </div>
      <div id="exerciseFooter" className="exercise-footer">
        <button className="skip-button" id="skipToRetentionBtn">
          Skip to breath hold
        </button>
        <button className="skip-button" id="skipRecoveryBtn" style={{ display: "none" }}>
          Skip recovery
        </button>
        <div className="recovery-subtitle" id="recoverySubtitle" style={{ display: "none" }}></div>
      </div>
    </div>

    <div id="retentionScreen" className="screen">
      <div className="round-info" id="retentionRoundInfo">Round 1 / 3</div>
      <div className="instruction" id="retentionInstruction">
        Hold your breath
      </div>
      <div className="retention-timer" id="retentionTimer">00:00</div>
      <div className="hexagon-container">
        <div className="hexagon phase-retention" id="retentionHexagon">
          <div className="breath-counter">■</div>
        </div>
      </div>
      <div className="tap-instruction" id="retentionTapInstruction">
        Tap when you need to breathe
      </div>
    </div>

    {/* RESULTS SCREEN */}
    <div id="resultsScreen" className="screen">
      <div className="results-title" id="resultsTitle">Session Results</div>
      <div id="resultsContent"></div>
      <button className="start-button" id="newSessionBtn">New Session</button>
    </div>
  </div>
  );
}

export default App;
