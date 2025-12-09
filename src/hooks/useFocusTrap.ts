/**
 * Focus Trap Hook
 *
 * Traps focus within a modal or dialog to improve accessibility.
 * Ensures keyboard navigation stays within the modal boundaries.
 * Automatically focuses the initial element when activated.
 *
 * @param isActive - Whether the focus trap should be active
 * @param initialFocusRef - Optional ref to element that should receive initial focus
 * @returns Ref to attach to the container element
 *
 * @example
 * ```tsx
 * const closeButtonRef = useRef<HTMLButtonElement>(null);
 * const containerRef = useFocusTrap({
 *   isActive: isOpen,
 *   initialFocusRef: closeButtonRef
 * });
 *
 * return <div ref={containerRef}>...</div>;
 * ```
 */

import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const useFocusTrap = ({ isActive, initialFocusRef }: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLElement | null>(
    null
  ) as React.MutableRefObject<HTMLElement | null>;

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
        (el) => {
          // Filter out elements that are not visible
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        }
      );
    };

    // Focus initial element or first focusable element
    const focusInitialElement = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    // Handle Tab key navigation
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

      // If no element is focused, focus the first one
      if (currentIndex === -1) {
        e.preventDefault();
        firstElement.focus();
        return;
      }

      // Shift+Tab: move to previous element or wrap to last
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move to next element or wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus initial element when modal opens
    const timeoutId = setTimeout(focusInitialElement, 100);

    // Add event listener for Tab key
    container.addEventListener('keydown', handleTabKey);

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, initialFocusRef]);

  return containerRef;
};
