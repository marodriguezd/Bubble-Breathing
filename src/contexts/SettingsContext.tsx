import React, { createContext, useState, useEffect, useContext } from 'react';

export interface AppConfig {
  speed: string;
  customTime: number;
  rounds: number;
  breaths: number;
  volume: number;
  soundscape: string;
  language: string;
  theme: string;
}

interface SettingsState {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
}

export const SettingsContext = createContext<SettingsState | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('bubbleBreathingConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          speed: parsed.speed || 'standard',
          customTime: parsed.customTime || 3.0,
          rounds: parsed.rounds || 3,
          breaths: parsed.breaths || 30,
          volume: parsed.volume !== undefined ? parsed.volume : 0.5,
          soundscape: parsed.soundscape || 'none',
          language: parsed.language || 'en',
          theme: parsed.theme || 'dark'
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      speed: 'standard',
      customTime: 3.0,
      rounds: 3,
      breaths: 30,
      volume: 0.5,
      soundscape: 'none',
      language: 'en',
      theme: 'dark'
    };
  });

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    localStorage.setItem('bubbleBreathingConfig', JSON.stringify(config));
    document.documentElement.setAttribute('data-theme', config.theme);
  }, [config]);

  return (
    <SettingsContext.Provider value={{ config, updateConfig }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

