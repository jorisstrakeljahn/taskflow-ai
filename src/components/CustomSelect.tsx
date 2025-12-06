import { useState, useRef, useEffect } from 'react';
import { IconChevronRight } from './Icons';

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CustomSelect = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      // Calculate if dropdown should open above or below and determine max height
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // If not enough space below but enough above, open upward
        if (spaceBelow < 240 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
      
      // Scroll dropdown into view on mobile
      if (dropdownRef.current && dropdownPosition === 'bottom') {
        setTimeout(() => {
          dropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all text-left flex items-center justify-between min-h-[44px] ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'
        } ${isOpen ? 'ring-2 ring-accent-light dark:ring-accent-dark border-transparent' : ''}`}
      >
        <span className={selectedOption ? '' : 'text-text-secondary-light dark:text-text-secondary-dark'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IconChevronRight
          className={`w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark transition-transform flex-shrink-0 ${
            isOpen ? 'transform rotate-90' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[9998] bg-transparent" 
            onClick={() => setIsOpen(false)}
            style={{ touchAction: 'none' }}
          />
          <div
            ref={dropdownRef}
            className={`absolute z-[9999] w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl overflow-y-auto overscroll-contain custom-scrollbar ${
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              maxHeight: (() => {
                const container = containerRef.current;
                if (!container) return '400px';
                const rect = container.getBoundingClientRect();
                if (dropdownPosition === 'top') {
                  return `${Math.min(400, rect.top - 20)}px`;
                } else {
                  return `${Math.min(400, window.innerHeight - rect.bottom - 20)}px`;
                }
              })(),
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2.5 text-left text-base transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value
                    ? 'bg-accent-light dark:bg-accent-dark text-white'
                    : 'text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

