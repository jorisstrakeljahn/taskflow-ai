import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface CompletedTasksSectionProps {
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
  onClose: () => void;
}

export const CompletedTasksSection = ({
  onShowCompletedTasks,
  completedTasksCount = 0,
  onClose,
}: CompletedTasksSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
          {t('settings.completedTasks.viewDescription')}
        </p>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          {t('settings.completedTasks.viewDescriptionDetail')}
        </p>
      </div>
      {onShowCompletedTasks && (
        <Button
          variant="primary"
          fullWidth
          onClick={() => {
            onShowCompletedTasks();
            onClose();
          }}
          className="flex items-center justify-between"
        >
          <span>{t('settings.completedTasks.showCompletedTasks')}</span>
          {completedTasksCount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white/20">
              {completedTasksCount}
            </span>
          )}
        </Button>
      )}
    </div>
  );
};
