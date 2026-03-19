import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress } from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import LanguageSwitcher from '~/components/LanguageSwitcher';
import { apiService } from '~/services/api';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  bgImage: string;
  version?: string;
}

function ForgotPassword({ onBackToLogin, bgImage, version }: ForgotPasswordProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiService.forgotPassword({ username, email });
      setSent(true);
    } catch (err) {
      console.error('Forgot password failed:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMessage || t('forgotPassword.sendFailed'));
    } finally {
      setLoading(false);
    }
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
            <MuiIcons.HistoryEdu sx={{ fontSize: 180, color: '#FF6B00', opacity: 0.8 }} />
          </div>
        </div>

        {/* Right Side - Forgot Password Card */}
        <div className="login-card">
          <h2 className="login-card-title">{t('forgotPassword.title')}</h2>

          {sent ? (
            <div className="text-center">
              <div className="login-error-msg" style={{ background: '#E6FFFA', color: '#38A169', borderColor: '#38A169' }}>
                {t('forgotPassword.emailSent')}
              </div>
              <p className="text-sm text-gray-600 mb-6">
                {t('forgotPassword.checkEmail')}
              </p>
              <button
                type="button"
                className="login-submit-btn"
                onClick={onBackToLogin}
              >
                {t('forgotPassword.backToLogin')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="login-error-msg">
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-500 mb-6 text-center">
                {t('forgotPassword.description')}
              </p>

              <div className="login-field-group">
                <label className="login-field-label">{t('forgotPassword.username')}</label>
                <TextField
                  fullWidth
                  size="small"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={t('forgotPassword.username')}
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
                <label className="login-field-label">{t('forgotPassword.email')}</label>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('forgotPassword.email')}
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
                disabled={loading || !username || !email}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: '#fff' }} />
                ) : (
                  t('forgotPassword.submit')
                )}
              </button>

              <button
                type="button"
                className="login-forgot-btn w-full text-center"
                onClick={onBackToLogin}
              >
                {t('forgotPassword.backToLogin')}
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

export default ForgotPassword;
