import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PrimaryColor = 
  | 'blue'
  | 'purple'
  | 'green'
  | 'red'
  | 'orange'
  | 'pink'
  | 'teal'
  | 'indigo'
  | 'amber'
  | 'emerald';

interface ColorConfig {
  light: string;
  dark: string;
  name: string;
}

const colorPalettes: Record<PrimaryColor, ColorConfig> = {
  blue: {
    light: '#3b82f6',
    dark: '#60a5fa',
    name: 'Blue',
  },
  purple: {
    light: '#a855f7',
    dark: '#c084fc',
    name: 'Purple',
  },
  green: {
    light: '#10b981',
    dark: '#34d399',
    name: 'Green',
  },
  red: {
    light: '#ef4444',
    dark: '#f87171',
    name: 'Red',
  },
  orange: {
    light: '#f97316',
    dark: '#fb923c',
    name: 'Orange',
  },
  pink: {
    light: '#ec4899',
    dark: '#f472b6',
    name: 'Pink',
  },
  teal: {
    light: '#14b8a6',
    dark: '#5eead4',
    name: 'Teal',
  },
  indigo: {
    light: '#6366f1',
    dark: '#818cf8',
    name: 'Indigo',
  },
  amber: {
    light: '#f59e0b',
    dark: '#fbbf24',
    name: 'Amber',
  },
  emerald: {
    light: '#059669',
    dark: '#34d399',
    name: 'Emerald',
  },
};

interface ColorContextType {
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  getColorValue: (mode: 'light' | 'dark') => string;
  getTextColor: (color: string) => 'white' | 'black';
  colorPalettes: Record<PrimaryColor, ColorConfig>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

// Function to calculate luminance and determine best text color
const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Initialize CSS variables synchronously before React renders
const initializeColorVariables = () => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const stored = localStorage.getItem('primary-color-preference');
  const initialColor = (stored as PrimaryColor) || 'blue';
  const lightColor = colorPalettes[initialColor].light;
  const darkColor = colorPalettes[initialColor].dark;
  
  root.style.setProperty('--accent-light', lightColor);
  root.style.setProperty('--accent-dark', darkColor);
};

// Initialize immediately
if (typeof window !== 'undefined') {
  initializeColorVariables();
}

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>(() => {
    const stored = localStorage.getItem('primary-color-preference');
    return (stored as PrimaryColor) || 'blue';
  });

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color);
    localStorage.setItem('primary-color-preference', color);
  };

  const getColorValue = (mode: 'light' | 'dark'): string => {
    return colorPalettes[primaryColor][mode];
  };

  const getTextColor = (color: string): 'white' | 'black' => {
    const luminance = getLuminance(color);
    // If luminance is less than 0.5, use white text, otherwise black
    return luminance < 0.5 ? 'white' : 'black';
  };

  // Update CSS variables when color changes
  useEffect(() => {
    const root = document.documentElement;
    const lightColor = colorPalettes[primaryColor].light;
    const darkColor = colorPalettes[primaryColor].dark;
    
    root.style.setProperty('--accent-light', lightColor);
    root.style.setProperty('--accent-dark', darkColor);
  }, [primaryColor]);

  return (
    <ColorContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        getColorValue,
        getTextColor,
        colorPalettes,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};

