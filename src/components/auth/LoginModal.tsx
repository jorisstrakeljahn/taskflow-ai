import React, { useState } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) => {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn({ email, password });
      toast.success(t('auth.loginSuccess') || 'Logged in successfully');
      onClose();
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t('auth.login')} level={1}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark"
          >
            {t('auth.email')}
          </label>
          <Input
            id="login-email"
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
            htmlFor="login-password"
            className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark"
          >
            {t('auth.password')}
          </label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? t('auth.loggingIn') : t('auth.login')}
          </Button>

          <div className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <span>{t('auth.noAccount')} </span>
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-accent-light dark:text-accent-dark hover:underline font-medium"
            >
              {t('auth.signUp')}
            </button>
          </div>
        </div>
      </form>
    </ResponsiveModal>
  );
};
