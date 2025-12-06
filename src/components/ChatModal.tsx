import { useState, useEffect, useRef } from 'react';
import { ResponsiveModal } from './ResponsiveModal';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useColor } from '../contexts/ColorContext';
import { useTheme } from '../hooks/useTheme';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export const ChatModal = ({
  isOpen,
  onClose,
  onSendMessage,
}: ChatModalProps) => {
  const { t } = useLanguage();
  const { getColorValue } = useColor();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const accentColor = getColorValue(isDark ? 'dark' : 'light');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      setIsProcessing(true);
      try {
        await onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('chat.title')}
    >
      <div className="flex flex-col gap-4 h-full">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
              {t('chat.description')}
            </p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic">
              {t('chat.example')}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chat.placeholder')}
              rows={6}
              className="px-3 py-3 border-2 border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
              style={{
                '--tw-ring-color': accentColor,
              } as React.CSSProperties & { '--tw-ring-color': string }}
              disabled={isProcessing}
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!message.trim() || isProcessing}
            >
              {isProcessing ? t('chat.processing') : t('chat.createTasks')}
            </Button>
          </form>
      </div>
    </ResponsiveModal>
  );
};
