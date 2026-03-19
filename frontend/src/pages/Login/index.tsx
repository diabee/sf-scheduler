import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress, Box } from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import LanguageSwitcher from '~/components/LanguageSwitcher';

import { apiService } from '~/services/api';

interface LoginProps {
  readonly onLogin: (username: string, password: string, captchaId?: string, captchaCode?: string) => Promise<void>;
  readonly onForgotPassword: () => void;
  readonly error?: string;
  readonly bgImage: string;
  readonly version?: string;
}

function Login({ onLogin, onForgotPassword, error, bgImage, version }: Readonly<LoginProps>) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; captcha?: string }>({});

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const response = await apiService.getCaptcha();
      setCaptchaId(response.captchaId);
      setCaptchaImage(response.captchaImage);
      setCaptchaCode('');
    } catch (err) {
      console.error('Failed to load captcha:', err);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkCaptcha = async () => {
      try {
        const enabled = await apiService.isCaptchaEnabled();
        setCaptchaEnabled(enabled);
        if (enabled) {
          await loadCaptcha();
        }
      } catch (err) {
        console.error('Failed to check captcha status:', err);
      }
    };
    checkCaptcha();
  }, [loadCaptcha]);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string; captcha?: string } = {};
    if (!username.trim()) {
      newErrors.username = t('validation.required');
    }
    if (!password.trim()) {
      newErrors.password = t('validation.required');
    }
    if (captchaEnabled && !captchaCode.trim()) {
      newErrors.captcha = t('validation.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onLogin(username, password, captchaEnabled ? captchaId : undefined, captchaEnabled ? captchaCode : undefined);
    } catch {
      if (captchaEnabled) {
        await loadCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url("${bgImage}")` }}>
      {/* Language Switcher */}
      <div className="login-lang-switcher">
        <LanguageSwitcher color="white" />
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
            <MuiIcons.Schedule sx={{ fontSize: 180, color: '#FF6B00', opacity: 0.8 }} />
          </div>
          <div className="login-features">
            <Box className="login-feature-item">
              <MuiIcons.Psychology sx={{ color: '#FF6B00', fontSize: 20 }} />
              <span>{t('auth.feature1', 'AI Management')}</span>
            </Box>
            <Box className="login-feature-item">
              <MuiIcons.Shield sx={{ color: '#FF6B00', fontSize: 20 }} />
              <span>{t('auth.feature2', 'Secure Network')}</span>
            </Box>
            <Box className="login-feature-item">
              <MuiIcons.AutoGraph sx={{ color: '#FF6B00', fontSize: 20 }} />
              <span>{t('auth.feature3', 'Peak Efficiency')}</span>
            </Box>
          </div>
        </div>

        {/* Right Side - Sign In Card */}
        <div className="login-card">
          <h2 className="login-card-title">{t('auth.signIn', 'SIGN IN')}</h2>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="login-error-msg">
                {t('auth.loginFailed')}
              </div>
            )}

            <div className="login-field-group">
              <label className="login-field-label">{t('auth.username')}</label>
              <TextField
                fullWidth
                size="medium"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                }}
                placeholder="user@example.com"
                autoFocus
                error={!!errors.username}
                helperText={errors.username}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '16px',
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#FF6B00' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                  },
                }}
              />
            </div>

            <div className="login-field-group">
              <label className="login-field-label">{t('auth.password')}</label>
              <TextField
                fullWidth
                size="medium"
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '16px',
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#FF6B00' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                  },
                }}
              />
            </div>

            {captchaEnabled && (
              <div className="login-field-group">
                <label className="login-field-label">{t('auth.captcha')}</label>
                <TextField
                  fullWidth
                  size="medium"
                  value={captchaCode}
                  onChange={e => {
                    setCaptchaCode(e.target.value);
                    if (errors.captcha) setErrors(prev => ({ ...prev, captcha: undefined }));
                  }}
                  error={!!errors.captcha}
                  helperText={errors.captcha}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '16px',
                      '& fieldset': { borderColor: '#ccc' },
                      '&:hover fieldset': { borderColor: '#FF6B00' },
                      '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                    },
                  }}
                />
                <div className="login-captcha-row">
                  {captchaLoading ? (
                    <div className="login-captcha-loading">
                      <CircularProgress size={20} sx={{ color: '#FF6B00' }} />
                    </div>
                  ) : (
                    <img
                      src={captchaImage}
                      alt="captcha"
                      className="login-captcha-img"
                      onClick={loadCaptcha}
                    />
                  )}
                  <button
                    type="button"
                    className="login-captcha-refresh"
                    onClick={loadCaptcha}
                    disabled={captchaLoading}
                  >
                    {t('auth.reCreateCaptcha', 'RE-CREATE CAPTCHA')}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: '#fff' }} />
              ) : (
                t('auth.login', 'SIGN IN')
              )}
            </button>

            <button
              type="button"
              className="login-forgot-btn"
              onClick={onForgotPassword}
            >
              {t('auth.forgotPassword')}
            </button>
          </form>
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

export default Login;
