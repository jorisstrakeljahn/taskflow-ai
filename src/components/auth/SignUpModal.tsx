import React, { useState } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      const errorMsg = t('auth.passwordMismatch');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (password.length < 6) {
      const errorMsg = t('auth.passwordTooShort');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        email,
        password,
        displayName: displayName || undefined,
      });
      toast.success(t('auth.signUpSuccess') || 'Account created successfully');
      onClose();
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.signUpError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t('auth.signUp')} level={1}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="signup-name"
            className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark"
          >
            {t('auth.displayName')} ({t('common.optional')})
          </label>
          <Input
            id="signup-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('auth.displayNamePlaceholder')}
            autoComplete="name"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark"
          >
            {t('auth.email')}
          </label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark"
          >
            {t('auth.password')}
          </label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            required
            autoComplete="new-password"
            minLength={6}
          />
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
            {t('auth.passwordMinLength')}
          </p>
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password"
            className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark"
          >
            {t('auth.confirmPassword')}
          </label>
          <Input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? t('auth.creatingAccount') : t('auth.signUp')}
          </Button>

          <div className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <span>{t('auth.haveAccount')} </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-accent-light dark:text-accent-dark hover:underline font-medium"
            >
              {t('auth.login')}
            </button>
          </div>
        </div>
      </form>
    </ResponsiveModal>
  );
};
