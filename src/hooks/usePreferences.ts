import { useState, useEffect } from 'react';

interface Preferences {
  fontSize: number;
  darkMode: boolean;
  showTranslation: boolean;
}

const STORAGE_KEY = 'masdar-hizib-prefs';
const DEFAULTS: Preferences = { fontSize: 22, darkMode: false, showTranslation: true };

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      // ignore parse errors
    }
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage errors
    }

    if (prefs.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [prefs]);

  const setFontSize = (size: number) =>
    setPrefs(p => ({ ...p, fontSize: Math.min(36, Math.max(14, size)) }));

  const toggleDarkMode = () =>
    setPrefs(p => ({ ...p, darkMode: !p.darkMode }));

  const toggleTranslation = () =>
    setPrefs(p => ({ ...p, showTranslation: !p.showTranslation }));

  return { prefs, setFontSize, toggleDarkMode, toggleTranslation };
}
