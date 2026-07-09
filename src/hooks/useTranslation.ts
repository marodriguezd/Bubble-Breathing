import { useSettings } from '../contexts/SettingsContext';

declare global {
  interface Window {
    translations?: Record<string, Record<string, string>>;
  }
}

export const useTranslation = () => {
  const { config } = useSettings();
  const lang = config.language || 'en';

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const translations = window.translations || {};
    const langDict = translations[lang] || translations['en'] || {};
    let text = langDict[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }

    return text;
  };

  return { t, language: lang };
};
