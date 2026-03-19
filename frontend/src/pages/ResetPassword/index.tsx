import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress } from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import LanguageSwitcher from '~/components/LanguageSwitcher';
import { apiService } from '~/services/api';
import type { ValidateTokenResponse } from '~/types';

interface ResetPasswordProps {
  token: string;
  onBackToLogin: () => void;
  bgImage: string;
  version?: string;
}

function ResetPassword({ token, onBackToLogin, bgImage, version }: ResetPasswordProps) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<ValidateTokenResponse | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateToken = useCallback(async () => {
    setValidating(true);
    try {
      const response = await apiService.validateResetToken(token);
      setTokenInfo(response);
    } catch (err) {
      console.error('Token validation failed:', err);
      setTokenInfo({ valid: false });
    } finally {
      setValidating(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      setError(t('resetPassword.passwordTooShort'));
      return;
    }

    setLoading(true);
    try {
      await apiService.resetPassword({ token, newPassword });
      setSuccess(true);
    } catch (err) {
      console.error('Password reset failed:', err);
      setError(t('resetPassword.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url("${bgImage}")` }}>
      {/* Language Switcher */}
      <div className="login-lang-switcher">
        <LanguageSwitcher />
      </div>

      {/* Orange Header Banner */}
      <div className="login-header-banner">
        <div className="login-header-content">
          <h1 className="login-brand-title">{t('auth.brandTitle', 'D8AI')}</h1>
          <p className="login-brand-subtitle">{t('auth.brandSubtitle', 'AI Agent Manager')}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="login-main-content">
        {/* Left Side - Bot Greeting */}
        <div className="login-left-panel">
          <h2 className="login-greeting">{t('auth.hello', 'Hello!')}</h2>
          <div className="login-bot-wrapper">
            <MuiIcons.LockReset sx={{ fontSize: 180, color: '#FF6B00', opacity: 0.8 }} />
          </div>
        </div>

        {/* Right Side - Reset Password Card */}
        <div className="login-card">
          <h2 className="login-card-title">{t('resetPassword.title')}</h2>

          {validating ? (
            <div className="flex justify-center py-8">
              <CircularProgress sx={{ color: '#FF6B00' }} />
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="login-error-msg" style={{ background: '#E6FFFA', color: '#38A169', borderColor: '#38A169' }}>
                {t('resetPassword.success')}
              </div>
              <button
                type="button"
                className="login-submit-btn"
                onClick={onBackToLogin}
              >
                {t('resetPassword.backToLogin')}
              </button>
            </div>
          ) : tokenInfo?.valid === false ? (
            <div className="text-center">
              <div className="login-error-msg">
                {t('resetPassword.tokenInvalid')}
              </div>
              <button
                type="button"
                className="login-submit-btn"
                onClick={onBackToLogin}
              >
                {t('resetPassword.backToLogin')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {tokenInfo?.email && (
                <p className="text-sm text-gray-500 mb-4 text-center">
                  {t('resetPassword.resetFor')}: {tokenInfo.email}
                </p>
              )}

              {tokenInfo?.remainingSeconds && tokenInfo.remainingSeconds > 0 && (
                <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded text-center">
                  {t('resetPassword.timeRemaining')}: {formatRemainingTime(tokenInfo.remainingSeconds)}
                </div>
              )}

              {error && (
                <div className="login-error-msg">
                  {error}
                </div>
              )}

              <div className="login-field-group">
                <label className="login-field-label">{t('resetPassword.newPassword')}</label>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={t('resetPassword.newPassword')}
                  required
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': { borderColor: '#ccc' },
                      '&:hover fieldset': { borderColor: '#FF6B00' },
                      '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                    },
                  }}
                />
              </div>

              <div className="login-field-group">
                <label className="login-field-label">{t('resetPassword.confirmPassword')}</label>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={t('resetPassword.confirmPassword')}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': { borderColor: '#ccc' },
                      '&:hover fieldset': { borderColor: '#FF6B00' },
                      '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                    },
                  }}
                />
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: '#fff' }} />
                ) : (
                  t('resetPassword.submit')
                )}
              </button>

              <button
                type="button"
                className="login-forgot-btn w-full text-center"
                onClick={onBackToLogin}
              >
                {t('resetPassword.backToLogin')}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <div className="flex justify-between w-full">
          <span>{version && `v${version} `}© {new Date().getFullYear()}, D8AI Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default ResetPassword;
