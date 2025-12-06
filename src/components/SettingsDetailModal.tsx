import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { IconClose, IconCheck } from './Icons';
import { Dashboard } from './Dashboard';

export type SettingsCategory = 'account' | 'completed-tasks' | 'dashboard' | 'appearance';

interface SettingsDetailModalProps {
  isOpen: boolean;
  category: SettingsCategory;
  onClose: () => void;
  onLogout?: () => void;
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  tasks?: any[];
}

export const SettingsDetailModal = ({
  isOpen,
  category,
  onClose,
  onLogout,
  onShowCompletedTasks,
  completedTasksCount = 0,
  onThemeChange,
  tasks = [],
}: SettingsDetailModalProps) => {
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

  const getTitle = () => {
    switch (category) {
      case 'account':
        return 'Account';
      case 'completed-tasks':
        return 'Completed Tasks';
      case 'dashboard':
        return 'Dashboard';
      case 'appearance':
        return 'Appearance';
      default:
        return 'Settings';
    }
  };

  const renderContent = () => {
    switch (category) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Email
                </span>
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  user@example.com
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  User ID
                </span>
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
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
          </div>
        );

      case 'completed-tasks':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                View all your completed tasks in one place.
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                You can review, reactivate, or delete completed tasks.
              </p>
            </div>
            {onShowCompletedTasks && (
              <button
                onClick={() => {
                  onShowCompletedTasks();
                  onClose();
                }}
                className="w-full px-4 py-3 bg-accent-light dark:bg-accent-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-between"
              >
                <span>Show Completed Tasks</span>
                {completedTasksCount > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white/20">
                    {completedTasksCount}
                  </span>
                )}
              </button>
            )}
          </div>
        );

      case 'dashboard':
        return (
          <div>
            <Dashboard tasks={tasks} hideTitle={true} />
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-3">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Theme
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
                  {theme === 'light' && (
                    <IconCheck className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                  )}
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
                  {theme === 'dark' && (
                    <IconCheck className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                  )}
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
                  {theme === 'system' && (
                    <IconCheck className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                  )}
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-2">
                Primary Color
              </span>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Coming soon: Customize your app's primary color.
              </p>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-2">
                Language
              </span>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Coming soon: Change the app language.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1002] animate-in fade-in"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`fixed ${
          isMobile
            ? 'bottom-0 left-0 right-0 rounded-t-3xl h-[85vh]'
            : 'top-1/2 left-1/2 max-w-lg w-full rounded-2xl h-[85vh]'
        } bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl z-[1003] flex flex-col touch-pan-y`}
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
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

