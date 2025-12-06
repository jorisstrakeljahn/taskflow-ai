import { IconGear } from './Icons';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            TaskFlow AI
          </h1>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <IconGear className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

