import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/Button';
import { IconUser, IconMail, IconLogOut, IconShield } from '../Icons';
import { logger } from '../../utils/logger';

interface AccountSectionProps {
  onLogout?: () => void;
}

export const AccountSection = ({ onLogout }: AccountSectionProps) => {
  const { t } = useLanguage();
  const { user, signOut, resetPassword } = useAuth();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string | null>(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      if (onLogout) {
        onLogout();
      }
      } catch (error) {
        logger.error('Logout error:', error);
      }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetPasswordError(null);
    setResetPasswordMessage(null);

    const email = resetPasswordEmail || user?.email || '';
    if (!email) {
      setResetPasswordError(t('auth.emailRequired'));
      return;
    }

    try {
      await resetPassword(email);
      setResetPasswordMessage(t('auth.passwordResetSent'));
      setResetPasswordEmail('');
    } catch (error: any) {
      setResetPasswordError(error.message || t('auth.passwordResetError'));
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          {t('settings.account.notLoggedIn')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="space-y-4">
        {/* Display Name */}
        {user.displayName && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <IconUser className="w-4 h-4" />
              <span className="font-medium">{t('settings.account.displayName')}</span>
            </div>
            <p className="text-text-primary-light dark:text-text-primary-dark pl-6">
              {user.displayName}
            </p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <IconMail className="w-4 h-4" />
            <span className="font-medium">{t('settings.account.email')}</span>
          </div>
          <p className="text-text-primary-light dark:text-text-primary-dark pl-6 break-all">
            {user.email}
          </p>
          {user.emailVerified && (
            <div className="flex items-center gap-1 pl-6 mt-1">
              <IconShield className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400">
                {t('settings.account.emailVerified')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Password Reset */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('settings.account.security')}
        </h3>

          {!isResettingPassword ? (
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                {t('settings.account.passwordResetDescription')}
              </p>
              <Button
                variant="secondary"
                onClick={() => setIsResettingPassword(true)}
                fullWidth
              >
                {t('settings.account.resetPassword')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary-light dark:text-text-primary-dark">
                  {t('settings.account.resetPasswordEmail')}
                </label>
                <input
                  type="email"
                  value={resetPasswordEmail || user.email || ''}
                  onChange={(e) => setResetPasswordEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                  disabled={!!user.email}
                />
                {user.email && (
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    {t('settings.account.usingAccountEmail')}
                  </p>
                )}
              </div>

              {resetPasswordMessage && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
                  {resetPasswordMessage}
                </div>
              )}

              {resetPasswordError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                  {resetPasswordError}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {t('settings.account.sendResetLink')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsResettingPassword(false);
                    setResetPasswordEmail('');
                    setResetPasswordMessage(null);
                    setResetPasswordError(null);
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          )}
      </div>

      {/* Logout Button */}
      <div className="pt-4">
        <Button
          variant="secondary"
          onClick={handleLogout}
          fullWidth
          className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white border-red-600 dark:border-red-600"
        >
          <div className="flex items-center justify-center gap-2">
            <IconLogOut className="w-4 h-4" />
            <span>{t('settings.account.logout')}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
