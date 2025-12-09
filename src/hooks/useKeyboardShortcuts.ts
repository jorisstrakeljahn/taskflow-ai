/**
 * Keyboard Shortcuts Hook
 *
 * Provides keyboard shortcuts for common actions:
 * - Ctrl/Cmd + K: Open chat
 * - Ctrl/Cmd + N: Create new task
 * - Escape: Close modals
 */

import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onChatOpen?: () => void;
  onTaskCreate?: () => void;
  onModalClose?: () => void;
  isModalOpen?: boolean;
}

export const useKeyboardShortcuts = ({
  onChatOpen,
  onTaskCreate,
  onModalClose,
  isModalOpen = false,
}: KeyboardShortcuts) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Escape: Close modal if open
      if (e.key === 'Escape' && isModalOpen && onModalClose) {
        e.preventDefault();
        onModalClose();
        return;
      }

      // Skip other shortcuts if typing in input field
      if (isInputField) return;

      // Ctrl/Cmd + K: Open chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onChatOpen?.();
        return;
      }

      // Ctrl/Cmd + N: Create new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onTaskCreate?.();
        return;
      }
    },
    [onChatOpen, onTaskCreate, onModalClose, isModalOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
