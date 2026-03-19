import { DEFAULT_BACKGROUND } from '~/configs/constants';
import type { AppConfig } from '~/types';

const STORAGE_KEYS = {
  CONFIG: 'app_config',
} as const;

export const StorageService = {
  getConfig: (): AppConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return stored ? JSON.parse(stored) : { backgroundImage: DEFAULT_BACKGROUND };
    } catch {
      return { backgroundImage: DEFAULT_BACKGROUND };
    }
  },

  saveConfig: (config: AppConfig): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },

  clearConfig: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  },
};
