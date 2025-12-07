import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface AccountSectionProps {
  onLogout?: () => void;
}

export const AccountSection = ({ onLogout }: AccountSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
            {t('settings.account.email')}
          </span>
          <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
            user@example.com
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
            {t('settings.account.userId')}
          </span>
          <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
            user-1
          </span>
        </div>
      </div>
      {onLogout && (
        <Button variant="danger" fullWidth onClick={onLogout}>
          {t('settings.account.logout')}
        </Button>
      )}
    </div>
  );
};

