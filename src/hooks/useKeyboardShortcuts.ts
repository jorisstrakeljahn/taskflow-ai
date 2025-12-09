/**
 * Keyboard Shortcuts Hook
 *
 * Provides global keyboard shortcuts for common actions.
 * Shortcuts are disabled when user is typing in input fields.
 *
 * @param onChatOpen - Function to open chat modal (Ctrl/Cmd + K)
 * @param onTaskCreate - Function to create new task (Ctrl/Cmd + N)
 * @param onModalClose - Function to close current modal (Escape)
 * @param isModalOpen - Whether a modal is currently open
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onChatOpen: () => setIsChatModalOpen(true),
 *   onTaskCreate: () => setIsTaskModalOpen(true),
 *   onModalClose: closeCurrentModal,
 *   isModalOpen: isAnyModalOpen
 * });
 * ```
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
