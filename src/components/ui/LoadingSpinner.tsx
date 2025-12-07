import { useLanguage } from '../../contexts/LanguageContext';

export const LoadingSpinner = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-light dark:border-accent-dark"></div>
      <p className="mt-4">{t('task.loadingTasks')}</p>
    </div>
  );
};
