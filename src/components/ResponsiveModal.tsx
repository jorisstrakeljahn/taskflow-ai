import { useRef, useEffect, useState, ReactNode } from 'react';
import { IconClose } from './Icons';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  subtitle?: string;
  zIndex?: number; // For stacking modals
  offsetRight?: number; // For stacking on desktop (offset in pixels)
}

export const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  children,
  subtitle,
  zIndex = 1001,
  offsetRight = 0,
}: ResponsiveModalProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (!isOpen) return null;

  // Mobile: Modal from bottom
  if (isMobile) {
    const translateY = currentY !== null ? currentY : 0;
    const transformStyle = `translateY(${translateY}px)`;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] animate-in fade-in"
          onClick={onClose}
        />
        <div
          ref={modalRef}
          className="fixed bottom-0 left-0 right-0 rounded-t-3xl h-[90vh] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl flex flex-col touch-pan-y"
          style={{
            zIndex,
            transform: transformStyle,
            transition: currentY === null ? 'transform 0.3s ease-out' : 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 cursor-grab active:cursor-grabbing" />
          <div className="flex items-center justify-between px-5 pb-4 border-b border-border-light dark:border-border-dark">
            <div>
              <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        </div>
      </>
    );
  }

  // Desktop: Panel from right
  // Panel starts off-screen (100%) and slides in to visible (0%) when opened
  // CSS transition handles the slide-in animation automatically
  const translateX = currentX !== null ? currentX : 0;
  const rightOffset = offsetRight;
  const panelWidth = 500; // Fixed width for desktop panel
  // Convert drag pixels to percentage of panel width
  // When dragging left to close: translateX pixels to the right
  const dragPercent = (translateX / panelWidth) * 100;
  // Base position: 0% = fully visible, add drag percent to move it right when closing
  const transformStyle = `translateX(${dragPercent}%)`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] animate-in fade-in"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`fixed top-0 h-full w-[500px] bg-card-light dark:bg-card-dark border-l border-border-light dark:border-border-dark shadow-2xl flex flex-col ${
          currentX === null ? 'animate-slide-in-right' : ''
        }`}
        style={{
          right: `${rightOffset}px`,
          zIndex,
          transform: currentX !== null ? transformStyle : undefined,
          transition: currentX === null ? 'none' : 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </>
  );
};

