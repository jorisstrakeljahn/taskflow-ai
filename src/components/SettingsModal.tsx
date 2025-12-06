import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { IconClose } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onLogout?: () => void;
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  onThemeChange,
  onLogout,
  onShowCompletedTasks,
  completedTasksCount = 0,
}: SettingsModalProps) => {
  const { theme } = useTheme();
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentY(null);
      setStartY(null);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      if (e.touches[0].clientY - rect.top < 60) {
        setStartY(e.touches[0].clientY);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null && modalRef.current) {
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        setCurrentY(deltaY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentY !== null && currentY > 100) {
      onClose();
    } else {
      setCurrentY(0);
    }
    setStartY(null);
    setTimeout(() => setCurrentY(null), 300);
  };

  if (!isOpen) return null;

  const translateY = currentY !== null ? currentY : 0;
  const isMobile = window.innerWidth <= 768;
  const transformStyle = isMobile
    ? `translateY(${translateY}px)`
    : `translate(-50%, calc(-50% + ${translateY}px))`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] animate-in fade-in"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`fixed ${
          isMobile
            ? 'bottom-0 left-0 right-0 rounded-t-3xl'
            : 'top-1/2 left-1/2 max-w-lg w-full rounded-2xl'
        } bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl z-[1001] flex flex-col max-h-[90vh] md:max-h-[80vh] touch-pan-y`}
        style={{
          transform: transformStyle,
          transition: currentY === null ? 'transform 0.3s ease-out' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 cursor-grab active:cursor-grabbing md:hidden" />
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Account Section */}
          <section className="mb-8">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Account
            </h3>
            <div className="space-y-3 mb-4">
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Email
                </span>
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  user@example.com
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  User ID
                </span>
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  user-1
                </span>
              </div>
            </div>
            {onLogout && (
              <button
                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                onClick={onLogout}
              >
                Logout
              </button>
            )}
          </section>

          {/* Tasks Section */}
          <section className="mb-8">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Tasks
            </h3>
            {onShowCompletedTasks && (
              <button
                onClick={() => {
                  onShowCompletedTasks();
                  onClose();
                }}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <span>Show Completed Tasks</span>
                {completedTasksCount > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-accent-light dark:bg-accent-dark text-white">
                    {completedTasksCount}
                  </span>
                )}
              </button>
            )}
          </section>

          {/* Appearance Section */}
          <section>
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Appearance
            </h3>
            <div>
              <div className="mb-3">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Design
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Choose between light, dark, or system design
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-accent-light dark:border-accent-dark bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('light')}
                  aria-label="Light design"
                >
                  <span className="text-2xl">☀️</span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Light
                  </span>
                </button>
                <button
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-accent-light dark:border-accent-dark bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('dark')}
                  aria-label="Dark design"
                >
                  <span className="text-2xl">🌙</span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Dark
                  </span>
                </button>
                <button
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'system'
                      ? 'border-accent-light dark:border-accent-dark bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('system')}
                  aria-label="System design"
                >
                  <span className="text-2xl">💻</span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    System
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
