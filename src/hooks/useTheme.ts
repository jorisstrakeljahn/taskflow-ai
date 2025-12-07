import { useState, useEffect } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem('theme-preference');
    return (stored as ThemePreference) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (preference: ThemePreference) => {
      let effectiveTheme: 'light' | 'dark';

      if (preference === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        effectiveTheme = preference;
      }

      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const setThemePreference = (preference: ThemePreference) => {
    setTheme(preference);
    localStorage.setItem('theme-preference', preference);
  };

  return { theme, setThemePreference };
};
