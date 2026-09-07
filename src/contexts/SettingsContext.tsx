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
    const omegaLang = localStorage.getItem('omega_language');
    const omegaTheme = localStorage.getItem('omega_theme');
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
          language: parsed.language || omegaLang || 'es',
          theme: parsed.theme || omegaTheme || 'dark'
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
      language: omegaLang || 'es',
      theme: omegaTheme || 'dark'
    };
  });

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      if (updates.language) {
        localStorage.setItem('omega_language', updates.language);
        window.dispatchEvent(new CustomEvent('subapp-sync', { detail: { language: updates.language } }));
      }
      if (updates.theme) {
        localStorage.setItem('omega_theme', updates.theme);
        window.dispatchEvent(new CustomEvent('subapp-sync', { detail: { theme: updates.theme } }));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleSync = () => {
      const omegaLang = localStorage.getItem('omega_language');
      const omegaTheme = localStorage.getItem('omega_theme');
      setConfig(prev => {
        const nextLang = omegaLang || prev.language;
        const nextTheme = omegaTheme || prev.theme;
        if (nextLang !== prev.language || nextTheme !== prev.theme) {
          return { ...prev, language: nextLang, theme: nextTheme };
        }
        return prev;
      });
    };

    window.addEventListener('omega-sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('omega-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

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

