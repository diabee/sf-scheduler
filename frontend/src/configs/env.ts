type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  env: Environment;
  apiBaseUrl: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  enableDevTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  isAuthBypass: boolean;
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
    isDevelopment,
    isStaging,
    isProduction,
    enableDevTools: isDevelopment || isStaging,
    logLevel: getLogLevel(env),
    isAuthBypass: import.meta.env.VITE_APP_AUTH_BYPASS === 'true',
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
