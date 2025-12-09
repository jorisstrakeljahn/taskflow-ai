/**
 * ChatInput Component
 * Input field for chat messages with send button
 */

import React, { useRef } from 'react';
import { Button } from '../../ui/Button';
import { Textarea } from '../../ui/Textarea';
import { IconRefreshCw } from '../../Icons';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRegenerate?: () => void;
  isProcessing: boolean;
  disabled?: boolean;
  showRegenerate?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onRegenerate,
  isProcessing,
  disabled = false,
  showRegenerate = false,
}: ChatInputProps) => {
  const { t } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessing && value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isProcessing && value.trim() && !disabled) {
            onSubmit();
          }
        }}
        className="flex gap-2"
      >
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            rows={3}
            disabled={isProcessing || disabled}
            className="resize-none pr-12"
          />
          {showRegenerate && onRegenerate && (
            <Button
              type="button"
              variant="secondary"
              onClick={onRegenerate}
              disabled={isProcessing || !value.trim() || disabled}
              className="absolute bottom-2 right-2 px-2 py-1 text-xs"
              title={t('chat.regenerate')}
              aria-label={t('chat.regenerate')}
            >
              <IconRefreshCw className="w-3 h-3" />
            </Button>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!value.trim() || isProcessing || disabled}
          className="self-end"
          aria-label={isProcessing ? t('chat.processing') : t('chat.send')}
        >
          {isProcessing ? t('chat.processing') : t('chat.send')}
        </Button>
      </form>
    </div>
  );
};
