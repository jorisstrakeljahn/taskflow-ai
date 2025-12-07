import { CenteredModal } from '../ui/CenteredModal';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Task } from '../../types/task';

interface DeleteTaskConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
  subtasksCount: number;
}

export const DeleteTaskConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  task,
  subtasksCount,
}: DeleteTaskConfirmModalProps) => {
  const { t } = useLanguage();

  if (!isOpen || !task) return null;

  const isSubtask = !!task.parentId;
  const hasSubtasks = subtasksCount > 0;

  const getTitle = () => {
    if (isSubtask) {
      return t('modals.deleteTask.subtaskTitle');
    }
    return t('modals.deleteTask.title');
  };

  const getDescription = () => {
    if (isSubtask) {
      return t('modals.deleteTask.subtaskDescription', { taskTitle: task.title });
    }
    if (hasSubtasks) {
      return t('modals.deleteTask.descriptionWithSubtasks', {
        taskTitle: task.title,
        subtasksCount,
      });
    }
    return t('modals.deleteTask.description', { taskTitle: task.title });
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <CenteredModal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
            {getDescription()}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {t('modals.deleteTask.warning')}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            fullWidth
            onClick={handleConfirm}
          >
            {t('modals.deleteTask.confirm')}
          </Button>
        </div>
      </div>
    </CenteredModal>
  );
};

