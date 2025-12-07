import { useColor } from '../contexts/ColorContext';
import { useTheme } from './useTheme';

/**
 * Custom hook to get the current accent color based on theme
 * Replaces repeated isDark calculation and getColorValue calls
 */
export const useAccentColor = () => {
  const { getColorValue } = useColor();
  const { theme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const accentColor = getColorValue(isDark ? 'dark' : 'light');

  return {
    accentColor,
    isDark,
  };
};
