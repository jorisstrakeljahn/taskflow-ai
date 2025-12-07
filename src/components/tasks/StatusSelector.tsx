import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TaskStatus } from '../../types/task';
import { TASK_STATUSES } from '../../constants/taskConstants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccentColor } from '../../hooks/useAccentColor';
import { IconChevronDown, IconCheck } from '../Icons';

interface StatusSelectorProps {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  disabled?: boolean;
}

export const StatusSelector = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}: StatusSelectorProps) => {
  const { t } = useLanguage();
  const { accentColor } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        // Check if click is on the dropdown portal
        const dropdownElement = document.querySelector('[data-status-dropdown]');
        if (dropdownElement && !dropdownElement.contains(target)) {
          setIsOpen(false);
          setDropdownPosition(null);
        } else if (!dropdownElement) {
          setIsOpen(false);
          setDropdownPosition(null);
        }
      }
    };

    if (isOpen) {
      // Use a small delay to avoid immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          // Use getBoundingClientRect() which gives viewport-relative coordinates
          // For fixed positioning, we don't need to add scrollY/scrollX
          setDropdownPosition({
            top: rect.bottom + 4, // 4px gap below button
            left: rect.left,
          });
        }
      };
      
      // Update position immediately
      updatePosition();
      
      // Update position on scroll (in case parent container scrolls)
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setDropdownPosition(null);
    }
  }, [isOpen]);

  const handleStatusClick = (status: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (status !== currentStatus && !disabled) {
      onStatusChange(status);
    }
    setIsOpen(false);
    setDropdownPosition(null);
  };

  // Get translation key - convert in_progress to inProgress for i18n
  const getStatusKey = (status: TaskStatus): string => {
    if (status === 'in_progress') return 'inProgress';
    return status;
  };

  if (disabled) {
    return (
      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
        {t(`status.${getStatusKey(currentStatus)}`)}
      </span>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative inline-block">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-all hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 cursor-pointer"
          disabled={disabled}
        >
          {t(`status.${getStatusKey(currentStatus)}`)}
          <IconChevronDown
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && dropdownPosition && typeof document !== 'undefined' && createPortal(
        <div
          data-status-dropdown
          className="fixed z-[10000] min-w-[140px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg py-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {TASK_STATUSES.map((status) => {
            const isSelected = status.value === currentStatus;
            return (
              <button
                key={status.value}
                type="button"
                onClick={(e) => handleStatusClick(status.value as TaskStatus, e)}
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                  isSelected
                    ? 'bg-accent-light/10 dark:bg-accent-dark/10'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                style={
                  isSelected
                    ? {
                        color: accentColor,
                      }
                    : {}
                }
              >
                <span className="text-text-primary-light dark:text-text-primary-dark">
                  {t(`status.${getStatusKey(status.value as TaskStatus)}`)}
                </span>
                {isSelected && (
                  <span style={{ color: accentColor }}>
                    <IconCheck className="w-4 h-4 flex-shrink-0" />
                  </span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
};

