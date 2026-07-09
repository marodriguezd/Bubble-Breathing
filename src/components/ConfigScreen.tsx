import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../contexts/SessionContext';

export const ConfigScreen = () => {
  const { config, updateConfig } = useSettings();
  const { setPhase, setCurrentRound, setCurrentBreath, setIsPlaying } = useSession();

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentRound(1);
    setCurrentBreath(1);
    setPhase('breathing');
  };

  const getEstimatedTime = () => {
    // simplified time logic
    return `${config.rounds * 3} min`; 
  };

  return (
    <div id="configScreen" className="screen active">
      <div className="hexagon-container">
        <div className="hexagon phase-breathing" id="previewHexagon">
          <div className="breath-counter" id="previewCounter">1</div>
        </div>
      </div>
      <div className="preview-label" id="previewLabel">Breathing Preview</div>
      
      <div className="speed-selector">
        {['slow', 'standard', 'custom', 'fast'].map((s) => (
          <button 
            key={s}
            className={`speed-btn ${config.speed === s ? 'active' : ''}`}
            onClick={() => updateConfig({ speed: s })}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {config.speed === 'custom' && (
        <div className="slider-group" id="customSpeedSliderGroup">
          <label>
            <span className="slider-label">Cycle Time:</span>
            <span>{config.customTime.toFixed(1)}s</span>
          </label>
          <input 
            type="range" 
            min="1.0" max="8.0" step="0.1" 
            value={config.customTime} 
            onChange={(e) => updateConfig({ customTime: parseFloat(e.target.value) })}
            className="slider" 
          />
        </div>
      )}

      <div className="slider-group">
        <label>
          <span className="slider-label">Rounds:</span>
          <span>{config.rounds}</span>
        </label>
        <input 
          type="range" min="1" max="11" 
          value={config.rounds} 
          onChange={(e) => updateConfig({ rounds: parseInt(e.target.value, 10) })}
          className="slider" 
        />
      </div>

      <div className="slider-group">
        <label>
          <span className="slider-label">Breaths:</span>
          <span>{config.breaths}</span>
        </label>
        <input 
          type="range" min="5" max="60" step="5" 
          value={config.breaths} 
          onChange={(e) => updateConfig({ breaths: parseInt(e.target.value, 10) })}
          className="slider" 
        />
      </div>

      <div className="slider-group">
        <label>
          <span className="slider-label">Volume:</span>
          <span>{Math.round(config.volume * 100)}%</span>
        </label>
        <input 
          type="range" min="0" max="100" step="5" 
          value={Math.round(config.volume * 100)} 
          onChange={(e) => updateConfig({ volume: parseInt(e.target.value, 10) / 100 })}
          className="slider" 
        />
      </div>

      <div className="estimated-time">
        Estimated time: <span id="estimated-time">{getEstimatedTime()}</span>
      </div>
      
      <div className="config-buttons">
        <button className="reset-config-btn" onClick={() => updateConfig({ speed: 'standard', rounds: 3, breaths: 30, volume: 0.5 })}>Reset</button>
        <button className="start-button" onClick={handleStart}>Start</button>
      </div>
    </div>
  );
};
