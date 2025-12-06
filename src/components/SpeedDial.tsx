import { useState } from 'react';

interface SpeedDialProps {
  onTaskClick: () => void;
  onChatClick: () => void;
}

export const SpeedDial = ({ onTaskClick, onChatClick }: SpeedDialProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTaskClick = () => {
    setIsOpen(false);
    onTaskClick();
  };

  const handleChatClick = () => {
    setIsOpen(false);
    onChatClick();
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[997] animate-in fade-in"
          onClick={handleOverlayClick}
        />
      )}
      <div className="fixed bottom-6 right-6 z-[998] flex flex-col items-center gap-4 md:gap-5">
        <button
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-lg flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-5 scale-90 pointer-events-none'
          } hover:scale-110 active:scale-95`}
          onClick={handleTaskClick}
          aria-label="Task erstellen"
          title="Task erstellen"
          style={{ transitionDelay: isOpen ? '50ms' : '0ms' }}
        >
          <span>📝</span>
        </button>
        <button
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-lg flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-5 scale-90 pointer-events-none'
          } hover:scale-110 active:scale-95`}
          onClick={handleChatClick}
          aria-label="Chat öffnen"
          title="Chat öffnen"
          style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
        >
          <span>💬</span>
        </button>
        <button
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent-light dark:bg-accent-dark text-white shadow-lg hover:shadow-xl flex items-center justify-center text-3xl md:text-4xl font-light transition-all duration-300 hover:scale-105 active:scale-95 z-[999]"
          onClick={handleMainClick}
          aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
          title={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          <span
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-45' : 'rotate-0'
            }`}
          >
            {isOpen ? '✕' : '+'}
          </span>
        </button>
      </div>
    </>
  );
};
