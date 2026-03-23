type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  env: Environment;
  apiBaseUrl: string;
  authApiBaseUrl: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  enableDevTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  isAuthBypass: boolean;
  oauth2AuthorizationUrl: string;
  portalLoginUrl: string;
}

const getEnvironment = (): Environment => {
  const mode = import.meta.env.MODE;
  if (mode === 'production') return 'production';
  if (mode === 'staging') return 'staging';
  return 'development';
};

const getLogLevel = (env: Environment): 'debug' | 'info' | 'warn' | 'error' => {
  switch (env) {
    case 'production':
      return 'error';
    case 'staging':
      return 'info';
    default:
      return 'debug';
  }
};

const createEnvConfig = (): EnvConfig => {
  const env = getEnvironment();
  const isDevelopment = env === 'development';
  const isStaging = env === 'staging';
  const isProduction = env === 'production';

  return {
    env,
    apiBaseUrl: import.meta.env.VITE_API_URL || '',
    authApiBaseUrl: import.meta.env.VITE_AUTH_API_URL || '',
    isDevelopment,
    isStaging,
    isProduction,
    enableDevTools: isDevelopment || isStaging,
    logLevel: getLogLevel(env),
    isAuthBypass: import.meta.env.VITE_APP_AUTH_BYPASS === 'true',
    oauth2AuthorizationUrl: import.meta.env.VITE_OAUTH2_AUTH_URL || '',
    portalLoginUrl: import.meta.env.VITE_PORTAL_LOGIN_URL || '',
  };
};

export const envConfig = createEnvConfig();

export const logger = {
  debug: (...args: unknown[]) => {
    if (['debug'].includes(envConfig.logLevel)) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (['debug', 'info'].includes(envConfig.logLevel)) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (['debug', 'info', 'warn'].includes(envConfig.logLevel)) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
};
