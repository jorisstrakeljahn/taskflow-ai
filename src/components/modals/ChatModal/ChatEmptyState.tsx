/**
 * ChatEmptyState Component
 * Displays empty state when no messages are present
 */

import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export const ChatEmptyState = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
          {t('chat.description')}
        </p>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic">
          {t('chat.example')}
        </p>
      </div>
    </div>
  );
};
