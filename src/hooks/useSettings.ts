import { useState, useEffect, useCallback } from 'react';

type FontSize = 'small' | 'normal' | 'large';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '14px',
  normal: '16px',
  large: '18px',
};

export function useSettings() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ki-dark-mode');
    if (saved !== null) return saved === 'true';
    return false;
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('ki-font-size') as FontSize) || 'normal';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ki-dark-mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-base', FONT_SIZE_MAP[fontSize]);
    localStorage.setItem('ki-font-size', fontSize);
  }, [fontSize]);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  return { darkMode, toggleDarkMode, fontSize, setFontSize };
}

export type { FontSize };
