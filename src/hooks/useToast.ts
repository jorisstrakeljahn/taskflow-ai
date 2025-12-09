/**
 * Custom hook for toast notifications
 * Provides a consistent API for showing success, error, and info messages
 * with theme-aware styling
 */

import toast, { ToastOptions } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from './useTheme';
import { useAccentColor } from './useAccentColor';

interface ToastConfig extends ToastOptions {
  duration?: number;
}

/**
 * Custom hook for toast notifications with theme support
 * @returns Object with toast methods (success, error, info, loading)
 */
export const useToast = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { accentColor } = useAccentColor();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Custom toast styles based on theme
  const toastStyle = {
    borderRadius: '0.5rem',
    background: isDark ? '#1F2937' : '#FFFFFF',
    color: isDark ? '#E5E7EB' : '#1F2937',
    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
    boxShadow: isDark
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
  };

  const success = (message: string, config?: ToastConfig) => {
    return toast.success(message, {
      ...config,
      style: {
        ...toastStyle,
        borderLeft: `4px solid #10B981`,
      },
      iconTheme: {
        primary: '#10B981',
        secondary: isDark ? '#1F2937' : '#FFFFFF',
      },
      duration: config?.duration || 3000,
    });
  };

  const error = (message: string, config?: ToastConfig) => {
    return toast.error(message, {
      ...config,
      style: {
        ...toastStyle,
        borderLeft: `4px solid #EF4444`,
      },
      iconTheme: {
        primary: '#EF4444',
        secondary: isDark ? '#1F2937' : '#FFFFFF',
      },
      duration: config?.duration || 4000,
    });
  };

  const info = (message: string, config?: ToastConfig) => {
    return toast(message, {
      ...config,
      style: {
        ...toastStyle,
        borderLeft: `4px solid ${accentColor}`,
      },
      iconTheme: {
        primary: accentColor,
        secondary: isDark ? '#1F2937' : '#FFFFFF',
      },
      duration: config?.duration || 3000,
    });
  };

  const loading = (message: string, config?: ToastConfig) => {
    return toast.loading(message, {
      ...config,
      style: toastStyle,
      duration: config?.duration || Infinity,
    });
  };

  return {
    success,
    error,
    info,
    loading,
    dismiss: toast.dismiss,
    remove: toast.remove,
  };
};
