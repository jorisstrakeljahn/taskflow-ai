/**
 * ChatProcessingIndicator Component
 * Shows loading state while AI is processing
 */

import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export const ChatProcessingIndicator = () => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {t('chat.thinking')}
        </p>
      </div>
    </div>
  );
};
