import { useState, useEffect } from 'react';

interface UseModalDragProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

interface UseModalDragReturn {
  startY: number | null;
  currentY: number | null;
  startX: number | null;
  currentX: number | null;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

/**
 * Custom hook to handle modal drag/swipe interactions
 */
export const useModalDrag = ({
  isOpen,
  isMobile,
  onClose,
  modalRef,
}: UseModalDragProps): UseModalDragReturn => {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentY(null);
      setStartY(null);
      setCurrentX(null);
      setStartX(null);
    }
  }, [isOpen]);

  // Touch handlers for mobile (swipe down) and desktop (swipe left from right edge)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      if (e.touches[0].clientY - rect.top < 60) {
        setStartY(e.touches[0].clientY);
      }
    } else if (!isMobile && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      // Allow drag from right edge (last 20px) or anywhere on the panel
      if (e.touches[0].clientX >= rect.right - 20) {
        setStartX(e.touches[0].clientX);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobile && startY !== null && modalRef.current) {
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        setCurrentY(deltaY);
      }
    } else if (!isMobile && startX !== null) {
      // On desktop, dragging left (negative delta) should close the panel
      const deltaX = startX - e.touches[0].clientX;
      if (deltaX > 0) {
        setCurrentX(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile && currentY !== null && currentY > 100) {
      onClose();
    } else if (!isMobile && currentX !== null && currentX > 100) {
      onClose();
    } else {
      setCurrentY(0);
      setCurrentX(0);
    }
    setStartY(null);
    setStartX(null);
    setTimeout(() => {
      setCurrentY(null);
      setCurrentX(null);
    }, 300);
  };

  // Mouse handlers for desktop (drag from right)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMobile && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      if (e.clientX - rect.left < 20 || rect.right - e.clientX < 20) {
        setStartX(e.clientX);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobile && startX !== null) {
      const deltaX = startX - e.clientX;
      if (deltaX > 0) {
        setCurrentX(deltaX);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isMobile && currentX !== null && currentX > 100) {
      onClose();
    } else {
      setCurrentX(0);
    }
    setStartX(null);
    setTimeout(() => {
      setCurrentX(null);
    }, 300);
  };

  return {
    startY,
    currentY,
    startX,
    currentX,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

