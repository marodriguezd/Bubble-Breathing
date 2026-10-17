import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../contexts/SessionContext';
import { useTranslation } from '../hooks/useTranslation';
import { BreathingSphere } from './BreathingSphere';
import { VolumeX, CloudRain, Wind, Waves, Play, Square } from 'lucide-react';

const speedSettings: Record<string, { inhale: number; exhale: number }> = {
  slow: { inhale: 2300, exhale: 1700 },      // 4.0s por ciclo (15 rpm)
  standard: { inhale: 1850, exhale: 1350 },  // 3.2s por ciclo (~19 rpm)
  fast: { inhale: 1350, exhale: 950 }        // 2.3s por ciclo (~26 rpm)
};

const getBreathTiming = (totalMs: number) => {
  // Inhalación diafragmática profunda activa (~60%), exhalación pasiva/soltar (~40%)
  const inhale = totalMs * 0.60;
  return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
};

export const ConfigScreen = () => {
  const { config, updateConfig } = useSettings();
  const { setPhase, setCurrentRound, setCurrentBreath, setIsPlaying, setSessionStartTime } = useSession();
  const { t } = useTranslation();

  const [previewBreathCount, setPreviewBreathCount] = useState(1);
  const [previewSubPhase, setPreviewSubPhase] = useState<'idle' | 'inhale' | 'exhale'>('idle');
  const [testingSoundscape, setTestingSoundscape] = useState<boolean>(false);
  const testSoundscapeRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setTestingSoundscape(false);
    setIsPlaying(true);
    setCurrentRound(1);
    setCurrentBreath(0); // Set to 0 so the first breath cycle increments it to 1
    setSessionStartTime(Date.now());
    setPhase('breathing');
  };

  // Clean up soundscape test audio on unmount
  useEffect(() => {
    return () => {
      if (testSoundscapeRef.current) {
        testSoundscapeRef.current.pause();
        testSoundscapeRef.current = null;
      }
    };
  }, []);

  // Control playback of the soundscape preview
  useEffect(() => {
    if (testingSoundscape && config.soundscape && config.soundscape !== 'none') {
      if (!testSoundscapeRef.current) {
        testSoundscapeRef.current = new Audio();
        testSoundscapeRef.current.loop = true;
      }
      const baseUrl = import.meta.env.BASE_URL || '/';
      const src = `${baseUrl}assets/${config.soundscape}.mp3`;
      if (testSoundscapeRef.current.src !== src) {
        testSoundscapeRef.current.src = src;
      }
      testSoundscapeRef.current.volume = config.volume;
      testSoundscapeRef.current.play().catch(e => console.warn("Preview playback failed:", e));
    } else {
      if (testSoundscapeRef.current) {
        testSoundscapeRef.current.pause();
      }
    }
  }, [testingSoundscape, config.soundscape, config.volume]);

  const getEstimatedTime = () => {
    const timings = config.speed === 'custom'
      ? getBreathTiming(config.customTime * 1000)
      : speedSettings[config.speed] || speedSettings.standard;
    const breathDuration = (timings.inhale + timings.exhale) / 1000;
    const estimatedApnea = 90;

    if (config.rounds === 11) return '∞';
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
    let easing = 'ease-in-out';

    if (previewSubPhase === 'inhale') {
      scale = 1.3;
      duration = timings.inhale;
      easing = 'ease-out';
    } else if (previewSubPhase === 'exhale') {
      scale = 0.9;
      duration = timings.exhale;
      easing = 'ease-in';
    }

    return {
      transform: `scale(${scale}) translateZ(0)`,
      transition: `transform ${duration}ms ${easing}`,
      willChange: 'transform'
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
      <BreathingSphere
        phase="breathing"
        scale={previewSubPhase === 'inhale' ? 1.3 : previewSubPhase === 'exhale' ? 0.92 : 1.0}
        durationMs={previewSubPhase === 'inhale' ? timings.inhale : previewSubPhase === 'exhale' ? timings.exhale : 300}
        easing={previewSubPhase === 'inhale' ? 'ease-out' : 'ease-in'}
        counter={previewBreathCount}
        id="previewHexagon"
      />
      <div className="preview-label" id="previewLabel">{t('previewLabel')}</div>
      
      <div className="speed-selector">
        {['slow', 'standard', 'fast', 'custom'].map((s) => (
          <button 
            key={s}
            className={`speed-btn ${config.speed === s ? 'active' : ''}`}
            onClick={() => updateConfig({ speed: s })}
          >
            {t(speedTranslationKeys[s] || s)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', margin: '0.6rem 0' }}>
        {config.speed === 'custom' && (
          <div className="slider-group" id="customSpeedSliderGroup">
            <label>
              <span className="slider-label">{t('customSpeedLabel')}</span>
              <span>{config.customTime.toFixed(1)}s</span>
            </label>
            <input 
              type="range" 
              min="1.5" max="6.0" step="0.1" 
              value={config.customTime} 
              onChange={(e) => updateConfig({ customTime: parseFloat(e.target.value) })}
              className="slider" 
            />
          </div>
        )}

        <div className="slider-group">
          <label>
            <span className="slider-label">{t('roundsLabel')}</span>
            <span>{config.rounds === 11 ? '∞' : config.rounds}</span>
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

        <div className="slider-group">
          <label>
            <span className="slider-label">{t('targetRetentionLabel', { defaultValue: 'Meta de apnea por ronda:' })}</span>
            <span>{config.targetRetentionSec === 0 ? t('targetRetentionFree', { defaultValue: 'Libre' }) : `${config.targetRetentionSec}s`}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginTop: '0.4rem' }}>
            {[0, 60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                type="button"
                className={`speed-btn ${config.targetRetentionSec === sec ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.2rem', fontSize: '0.75rem', borderRadius: '8px' }}
                onClick={() => updateConfig({ targetRetentionSec: sec })}
              >
                {sec === 0 ? t('targetRetentionFree', { defaultValue: 'Libre' }) : `${sec}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-group">
          <label>
            <span className="slider-label">{t('recoveryDurationLabel', { defaultValue: 'Inhalación de recuperación:' })}</span>
            <span>{config.recoveryDurationSec || 15}s</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginTop: '0.4rem' }}>
            {[10, 15, 20, 30].map((sec) => (
              <button
                key={sec}
                type="button"
                className={`speed-btn ${(config.recoveryDurationSec || 15) === sec ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.2rem', fontSize: '0.75rem', borderRadius: '8px' }}
                onClick={() => updateConfig({ recoveryDurationSec: sec })}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        <div className="soundscape-selector-group">
          <details className="soundscape-details">
            <summary className="soundscape-summary">
              <div className="soundscape-summary-left">
                <span className="slider-label">{t('soundscapeLabel', { defaultValue: 'Sound:' })}</span>
                <span className="soundscape-current-value">
                  {t(`soundscape_${config.soundscape}`)}
                </span>
              </div>
              <div className="soundscape-summary-right">
                <span className="soundscape-arrow">▼</span>
              </div>
            </summary>
            
            <div className="soundscape-expanded-content">
              <div className="soundscape-grid">
                <button 
                  type="button"
                  className={`soundscape-btn ${config.soundscape === 'none' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    updateConfig({ soundscape: 'none' });
                    setTestingSoundscape(false);
                  }}
                >
                  <span className="soundscape-icon" style={{ display: 'flex' }}><VolumeX size={20} /></span>
                  <span className="soundscape-name">{t('soundscape_none')}</span>
                </button>
                <button 
                  type="button"
                  className={`soundscape-btn ${config.soundscape === 'rain' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    updateConfig({ soundscape: 'rain' });
                  }}
                >
                  <span className="soundscape-icon" style={{ display: 'flex' }}><CloudRain size={20} /></span>
                  <span className="soundscape-name">{t('soundscape_rain')}</span>
                </button>
                <button 
                  type="button"
                  className={`soundscape-btn ${config.soundscape === 'whitenoise' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    updateConfig({ soundscape: 'whitenoise' });
                  }}
                >
                  <span className="soundscape-icon" style={{ display: 'flex' }}><Wind size={20} /></span>
                  <span className="soundscape-name">{t('soundscape_whitenoise')}</span>
                </button>
                <button 
                  type="button"
                  className={`soundscape-btn ${config.soundscape === 'ocean' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    updateConfig({ soundscape: 'ocean' });
                  }}
                >
                  <span className="soundscape-icon" style={{ display: 'flex' }}><Waves size={20} /></span>
                  <span className="soundscape-name">{t('soundscape_ocean')}</span>
                </button>
              </div>
              
              {config.soundscape !== 'none' && (
                <button
                  type="button"
                  className={`soundscape-test-btn ${testingSoundscape ? 'testing' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTestingSoundscape(!testingSoundscape);
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {testingSoundscape ? <><Square size={16} fill="currentColor" /> {t('stop_preview')}</> : <><Play size={16} fill="currentColor" /> {t('test_soundscape')}</>}
                </button>
              )}
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
      </div>

      <div className="estimated-time">
        {t('estimated_time')}: <span id="estimated-time">{getEstimatedTime()}</span>
      </div>
      
      <div className="config-buttons">
        <button 
          className="reset-config-btn" 
          onClick={() => {
            updateConfig({ speed: 'standard', customTime: 3.0, rounds: 3, breaths: 30, volume: 0.5, soundscape: 'none', targetRetentionSec: 0 });
            setTestingSoundscape(false);
          }}
        >
          {t('resetConfigBtn')}
        </button>
        <button 
          className="reset-config-btn" 
          onClick={() => {
            setTestingSoundscape(false);
            setPhase('stats');
          }}
        >
          {t('statsBtn', { defaultValue: 'Stats' })}
        </button>
        <button className="start-button" onClick={handleStart}>{t('startBtn')}</button>
      </div>
    </div>
  );
};

