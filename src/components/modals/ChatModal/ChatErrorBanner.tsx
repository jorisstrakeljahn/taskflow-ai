/**
 * ChatErrorBanner Component
 * Displays error messages in the chat
 */

import React from 'react';
import { Button } from '../../ui/Button';
import { IconAlertCircle } from '../../Icons';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ChatErrorBannerProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export const ChatErrorBanner = ({ error, onRetry, onDismiss }: ChatErrorBannerProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-3 flex-shrink-0">
      <div className="flex items-start gap-2">
        <IconAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
        </div>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry} className="text-xs px-2 py-1">
            {t('chat.retry')}
          </Button>
        )}
        <Button variant="secondary" onClick={onDismiss} className="text-xs px-2 py-1">
          {t('common.close')}
        </Button>
      </div>
    </div>
  );
};
