import { useSettings } from '../contexts/SettingsContext';

declare global {
  interface Window {
    translations?: Record<string, Record<string, string>>;
    bubbleTranslations?: Record<string, Record<string, string>>;
  }
}

export const useTranslation = () => {
  const { config } = useSettings();
  const lang = config.language || 'en';

  const t = (key: string, replacements?: (Record<string, string | number> & { defaultValue?: string }) | { defaultValue?: string }): string => {
    const bubbleDict = window.bubbleTranslations?.[lang] || window.bubbleTranslations?.['en'] || {};
    const globalDict = window.translations?.[lang] || window.translations?.['en'] || {};
    let text = bubbleDict[key] || globalDict[key] || (replacements && 'defaultValue' in replacements ? replacements.defaultValue : undefined) || key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        if (placeholder !== 'defaultValue') {
          text = text.replace(`{${placeholder}}`, String(value));
        }
      });
    }

    return text;
  };

  return { t, language: lang };
};
