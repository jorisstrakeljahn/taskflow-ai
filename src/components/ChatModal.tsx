import { useState, useEffect, useRef } from 'react';
import { ResponsiveModal } from './ResponsiveModal';

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
      title="AI Task Chat"
    >
      <div className="flex flex-col gap-4 h-full">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
              Share your thoughts - I'll create structured tasks from them!
            </p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic">
              Example: "I need to finish the presentation tomorrow, then go
              grocery shopping and schedule the doctor appointment"
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={6}
              className="px-3 py-3 border-2 border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="w-full px-4 py-3.5 bg-accent-light dark:bg-accent-dark text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed min-h-[48px]"
              disabled={!message.trim() || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Create Tasks'}
            </button>
          </form>
      </div>
    </ResponsiveModal>
  );
};
