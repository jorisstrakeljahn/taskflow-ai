import React, { memo } from 'react';
import { IconSettings } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onSettingsClick: () => void;
}

const HeaderComponent = ({ onSettingsClick }: HeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('app.title')}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('settings.title')}
            >
              <IconSettings className="w-5 h-5 text-text-primary-light dark:text-text-primary-dark" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
