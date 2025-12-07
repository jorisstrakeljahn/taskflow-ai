import { useState, useRef } from 'react';

interface UseTaskSwipeProps {
  onSwipeLeft?: () => void; // Delete
  onSwipeRight?: () => void; // Edit
  threshold?: number; // Minimum swipe distance in pixels
}

interface UseTaskSwipeReturn {
  swipeOffset: number;
  isSwiping: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

/**
 * Custom hook to handle swipe gestures on task items
 * Swipe left = delete, Swipe right = edit
 */
export const useTaskSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
}: UseTaskSwipeProps): UseTaskSwipeReturn => {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartTime = useRef<number | null>(null);

  const swipeOffset = currentX !== null ? currentX : 0;

  const resetSwipe = () => {
    setStartX(null);
    setCurrentX(null);
    setIsSwiping(false);
    touchStartTime.current = null;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't start swipe if touching on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('[data-status-dropdown]') ||
      target.closest('[data-priority-dropdown]')
    ) {
      return;
    }

    setStartX(e.touches[0].clientX);
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null) return;

    const deltaX = e.touches[0].clientX - startX;

    // Only allow horizontal swipes (not vertical scrolling)
    if (Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      setCurrentX(deltaX);
      // Prevent scrolling while swiping
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (startX === null || currentX === null) {
      resetSwipe();
      return;
    }

    const deltaX = currentX;
    const swipeDuration = touchStartTime.current ? Date.now() - touchStartTime.current : 0;

    // Check if it's a valid swipe (fast enough or far enough)
    const isFastSwipe = swipeDuration < 300 && Math.abs(deltaX) > 30;
    const isLongSwipe = Math.abs(deltaX) > threshold;

    if (isFastSwipe || isLongSwipe) {
      if (deltaX < -threshold && onSwipeLeft) {
        // Swipe left = delete
        onSwipeLeft();
      } else if (deltaX > threshold && onSwipeRight) {
        // Swipe right = edit
        onSwipeRight();
      }
    }

    // Reset with animation
    setTimeout(() => {
      resetSwipe();
    }, 200);
  };

  // Mouse handlers for desktop (for testing, but mainly use hover menu)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only on mobile-sized screens or if explicitly enabled
    if (window.innerWidth > 768) return;

    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('[data-status-dropdown]') ||
      target.closest('[data-priority-dropdown]')
    ) {
      return;
    }

    setStartX(e.clientX);
    touchStartTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX === null || window.innerWidth > 768) return;

    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      setCurrentX(deltaX);
    }
  };

  const handleMouseUp = () => {
    if (startX === null || currentX === null || window.innerWidth > 768) {
      resetSwipe();
      return;
    }

    const deltaX = currentX;
    const swipeDuration = touchStartTime.current ? Date.now() - touchStartTime.current : 0;

    const isFastSwipe = swipeDuration < 300 && Math.abs(deltaX) > 30;
    const isLongSwipe = Math.abs(deltaX) > threshold;

    if (isFastSwipe || isLongSwipe) {
      if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft();
      } else if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      }
    }

    setTimeout(() => {
      resetSwipe();
    }, 200);
  };

  return {
    swipeOffset,
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
