import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../contexts/SessionContext';
import { useTranslation } from '../hooks/useTranslation';

const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2500, exhale: 1500 },
  standard: { inhale: 2000, exhale: 1000 },
  fast: { inhale: 1000, exhale: 1000 }
};

const getBreathTiming = (totalMs: number) => {
  let inhale;
  if (totalMs <= 2000) {
    inhale = totalMs / 2;
  } else if (totalMs <= 3000) {
    inhale = 1000 + (totalMs - 2000); 
  } else {
    inhale = 2000 + (totalMs - 3000) * 0.5;
  }
  return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
};

export const ConfigScreen = () => {
  const { config, updateConfig } = useSettings();
  const { setPhase, setCurrentRound, setCurrentBreath, setIsPlaying } = useSession();
  const { t } = useTranslation();

  const [previewBreathCount, setPreviewBreathCount] = useState(1);
  const [previewSubPhase, setPreviewSubPhase] = useState<'idle' | 'inhale' | 'exhale'>('idle');

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentRound(1);
    setCurrentBreath(0); // Set to 0 so the first breath cycle increments it to 1
    setPhase('breathing');
  };

  const playPreview = (soundName: string) => {
    if (soundName === 'none') return;
    const ext = soundName === 'ocean' ? 'mp3' : 'wav';
    const audio = new Audio(`assets/${soundName}.${ext}`);
    audio.volume = config.volume;
    audio.play().catch(e => console.error("Preview blocked:", e));
    
    // Simple fade out after 3 seconds
    setTimeout(() => {
      let vol = audio.volume;
      const fade = setInterval(() => {
        if (vol > 0.1) {
          vol -= 0.1;
          audio.volume = vol;
        } else {
          clearInterval(fade);
          audio.pause();
          audio.src = "";
        }
      }, 100);
    }, 3000);
  };

  const getEstimatedTime = () => {
    const timings = config.speed === 'custom'
      ? getBreathTiming(config.customTime * 1000)
      : speedSettings[config.speed] || speedSettings.standard;
    const breathDuration = (timings.inhale + timings.exhale) / 1000;
    const estimatedApnea = 90;

    const totalSeconds = config.rounds * (config.breaths * breathDuration + estimatedApnea);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);

    return `~${minutes}m ${seconds}s`;
  };

  const timings = config.speed === 'custom'
    ? getBreathTiming(config.customTime * 1000)
    : speedSettings[config.speed] || speedSettings.standard;

  useEffect(() => {
    setPreviewBreathCount(1);
    setPreviewSubPhase('idle');

    let previewInhaleTimer: number | null = null;
    let previewExhaleTimer: number | null = null;

    const runPreviewCycle = (isFirst: boolean) => {
      if (!isFirst) {
        setPreviewBreathCount((c) => c + 1);
      }
      setPreviewSubPhase('inhale');

      previewInhaleTimer = window.setTimeout(() => {
        setPreviewSubPhase('exhale');

        previewExhaleTimer = window.setTimeout(() => {
          runPreviewCycle(false);
        }, timings.exhale);

      }, timings.inhale);
    };

    const startTimer = window.setTimeout(() => {
      runPreviewCycle(true);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      if (previewInhaleTimer) clearTimeout(previewInhaleTimer);
      if (previewExhaleTimer) clearTimeout(previewExhaleTimer);
    };
  }, [config.speed, config.customTime, timings.inhale, timings.exhale]);

  const getPreviewStyles = () => {
    let scale = 1.0;
    let duration = 300;

    if (previewSubPhase === 'inhale') {
      scale = 1.3;
      duration = timings.inhale;
    } else if (previewSubPhase === 'exhale') {
      scale = 0.9;
      duration = timings.exhale;
    }

    return {
      transform: `scale(${scale})`,
      transition: `transform ${duration}ms ease-in-out`
    };
  };

  const speedTranslationKeys: Record<string, string> = {
    slow: 'speedSlow',
    standard: 'speedStandard',
    custom: 'speedCustom',
    fast: 'speedFast'
  };

  return (
    <div id="configScreen" className="screen active">
      <div className="hexagon-container">
        <div 
          className="hexagon phase-breathing" 
          id="previewHexagon"
          style={getPreviewStyles()}
        >
          <div className="breath-counter" id="previewCounter">{previewBreathCount}</div>
        </div>
      </div>
      <div className="preview-label" id="previewLabel">{t('previewLabel')}</div>
      
      <div className="speed-selector">
        {['slow', 'standard', 'custom', 'fast'].map((s) => (
          <button 
            key={s}
            className={`speed-btn ${config.speed === s ? 'active' : ''}`}
            onClick={() => updateConfig({ speed: s })}
          >
            {t(speedTranslationKeys[s] || s)}
          </button>
        ))}
      </div>

      {config.speed === 'custom' && (
        <div className="slider-group" id="customSpeedSliderGroup">
          <label>
            <span className="slider-label">{t('customSpeedLabel')}</span>
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
          <span className="slider-label">{t('roundsLabel')}</span>
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
          <span className="slider-label">{t('breathsLabel')}</span>
          <span>{config.breaths}</span>
        </label>
        <input 
          type="range" min="5" max="60" step="5" 
          value={config.breaths} 
          onChange={(e) => updateConfig({ breaths: parseInt(e.target.value, 10) })}
          className="slider" 
        />
      </div>

      <div className="slider-group" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <details style={{ width: '100%', cursor: 'pointer' }}>
          <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="slider-label" style={{ margin: 0 }}>{t('soundscapeLabel', { defaultValue: 'Sound:' })}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.8 }}>
                {t(`soundscape_${config.soundscape}`)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {config.soundscape !== 'none' && (
                <button 
                  onClick={(e) => { e.preventDefault(); playPreview(config.soundscape); }}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    fontSize: '1.2rem', padding: '0', display: 'flex', alignItems: 'center' 
                  }}
                  title="Preview Sound"
                >
                  ▶️
                </button>
              )}
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>▼</span>
            </div>
          </summary>
          <div className="speed-selector" style={{ margin: '15px 0 0 0' }}>
            {['none', 'rain', 'whitenoise', 'ocean'].map((s) => (
              <button 
                key={s}
                className={`speed-btn ${config.soundscape === s ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  updateConfig({ soundscape: s as any });
                }}
                style={{ flex: 1, padding: '0.4rem 0.2rem', fontSize: '0.85rem' }}
              >
                {t(`soundscape_${s}`)}
              </button>
            ))}
          </div>
        </details>
      </div>

      <div className="slider-group">
        <label>
          <span className="slider-label">{t('volumeLabel')}</span>
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
        {t('estimated_time')}: <span id="estimated-time">{getEstimatedTime()}</span>
      </div>
      
      <div className="config-buttons">
        <button 
          className="reset-config-btn" 
          onClick={() => updateConfig({ speed: 'standard', customTime: 3.0, rounds: 3, breaths: 30, volume: 0.5, soundscape: 'none' })}
        >
          {t('resetConfigBtn')}
        </button>
        <button 
          className="reset-config-btn" 
          onClick={() => setPhase('stats')}
        >
          {t('statsBtn', { defaultValue: 'Stats' })}
        </button>
        <button className="start-button" onClick={handleStart}>{t('startBtn')}</button>
      </div>
    </div>
  );
};

