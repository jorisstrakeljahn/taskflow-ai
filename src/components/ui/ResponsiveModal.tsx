import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import type { ReactNode, RefObject } from 'react';
import { IconClose } from '../Icons';
import { useModalDrag } from '../../hooks/useModalDrag';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  subtitle?: string;
  zIndex?: number; // For stacking modals
  offsetRight?: number; // For stacking on desktop (offset in pixels)
  level?: number; // 1 = main modal, 2 = submodal (affects height on mobile and parent modal behavior)
  parentModalRef?: RefObject<HTMLDivElement>; // Reference to parent modal for scaling/opacity
}

export const ResponsiveModal = forwardRef<HTMLDivElement, ResponsiveModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      subtitle,
      zIndex = 1001,
      offsetRight = 0,
      level = 1,
      parentModalRef,
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);

    const {
      currentY,
      currentX,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    } = useModalDrag({
      isOpen,
      isMobile,
      onClose,
      modalRef,
    });

    // Expose modal ref to parent component
    useImperativeHandle(ref, () => modalRef.current!);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      if (isOpen) {
        setIsInitialMount(true);

        // Trigger slide-in animation after mount (small delay to ensure initial render)
        if (!isMobile) {
          setTimeout(() => {
            setIsInitialMount(false);
          }, 10);
        }

        // Handle parent modal styling when submodal opens
        if (level === 2 && parentModalRef?.current) {
          if (isMobile) {
            // Mobile: Disable and fade out parent modal
            parentModalRef.current.style.opacity = '0.5';
            parentModalRef.current.style.pointerEvents = 'none';
            parentModalRef.current.style.transition = 'opacity 0.3s ease-out';
          } else {
            // Desktop: Scale down and fade parent modal
            parentModalRef.current.style.transform = 'scale(0.9)';
            parentModalRef.current.style.opacity = '0.7';
            parentModalRef.current.style.pointerEvents = 'none';
            parentModalRef.current.style.transition =
              'transform 0.3s ease-out, opacity 0.3s ease-out';
          }
        }
      } else {
        setIsInitialMount(true);
        // Restore parent modal when submodal closes
        if (level === 2 && parentModalRef?.current) {
          parentModalRef.current.style.transform = '';
          parentModalRef.current.style.opacity = '';
          parentModalRef.current.style.pointerEvents = '';
        }
      }

      return () => {
        // Cleanup: restore parent modal when component unmounts
        if (level === 2 && parentModalRef?.current) {
          parentModalRef.current.style.transform = '';
          parentModalRef.current.style.opacity = '';
          parentModalRef.current.style.pointerEvents = '';
        }
      };
    }, [isOpen, level, parentModalRef, isMobile]);

    if (!isOpen) return null;

    // Determine modal height based on level (mobile only)
    const mobileHeight = level === 2 ? 'h-[85vh]' : 'h-[90vh]';

    // Mobile: Modal from bottom
    if (isMobile) {
      const translateY = currentY !== null ? currentY : 0;
      const transformStyle = `translateY(${translateY}px)`;

      return (
        <>
          {/* Backdrop - only clickable if no submodal is open (handled by parent) */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] animate-in fade-in"
            onClick={level === 1 ? onClose : undefined}
            style={{ pointerEvents: level === 2 ? 'none' : 'auto' }}
          />
          <div
            ref={modalRef}
            className={`fixed bottom-0 left-0 right-0 rounded-t-3xl ${mobileHeight} bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl flex flex-col touch-pan-y`}
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
    const translateX = currentX !== null ? currentX : 0;
    const panelWidth = 500; // Fixed width for desktop panel
    // For submodals (level 2), position them to the left of parent modal
    // offsetRight positions the submodal next to the parent (500px = width of parent panel)
    const rightOffset = level === 2 ? offsetRight : 0;
    // Convert drag pixels to percentage of panel width
    // When dragging left to close: translateX pixels to the right
    const dragPercent = (translateX / panelWidth) * 100;

    // For animation: Start at 100% (off-screen right) and animate to 0% (visible)
    // isInitialMount: true = start position (100% off-screen), false = end position (0% visible)
    const isDragging = currentX !== null && currentX > 0;
    const slideInTranslate = isInitialMount ? 100 : 0;
    const finalTranslate = slideInTranslate + dragPercent;
    const transformStyle = `translateX(${finalTranslate}%)`;

    return (
      <>
        {/* Backdrop - only clickable if no submodal is open */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] animate-in fade-in"
          onClick={level === 1 ? onClose : undefined}
          style={{ pointerEvents: level === 2 ? 'none' : 'auto' }}
        />
        <div
          ref={modalRef}
          className="fixed top-0 h-full w-[500px] bg-card-light dark:bg-card-dark border-l border-border-light dark:border-border-dark shadow-2xl flex flex-col"
          style={{
            right: `${rightOffset}px`,
            zIndex,
            transform: transformStyle,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
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
  }
);

ResponsiveModal.displayName = 'ResponsiveModal';
