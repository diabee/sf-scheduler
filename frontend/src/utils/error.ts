import { logger } from '~/configs/env';
import type { ApiError } from '~/types';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = 'E1000', statusCode?: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const ErrorCode = {
  NETWORK_ERROR: 'E1001',
  UNAUTHORIZED: 'E1002',
  FORBIDDEN: 'E1003',
  NOT_FOUND: 'E1004',
  VALIDATION_ERROR: 'E1005',
  SERVER_ERROR: 'E1006',
  UNKNOWN_ERROR: 'E1000',
  // API specific error codes
  INVALID_EMAIL: 'INVALID_EMAIL',
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
  USERNAME_REQUIRED: 'USERNAME_REQUIRED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_EXISTS: 'USER_EXISTS',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_CAPTCHA: 'INVALID_CAPTCHA',
} as const;

export const ErrorMessage: Record<string, string> = {
  [ErrorCode.NETWORK_ERROR]: 'Network connection failed',
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  [ErrorCode.FORBIDDEN]: 'Access denied',
  [ErrorCode.NOT_FOUND]: 'Resource not found',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid input data',
  [ErrorCode.SERVER_ERROR]: 'Server error occurred',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred',
};

// Map error codes to i18n keys
export const ErrorI18nKey: Record<string, string> = {
  [ErrorCode.NETWORK_ERROR]: 'errors.networkError',
  [ErrorCode.UNAUTHORIZED]: 'errors.permissionDenied',
  [ErrorCode.FORBIDDEN]: 'errors.permissionDenied',
  [ErrorCode.NOT_FOUND]: 'errors.userNotFound',
  [ErrorCode.VALIDATION_ERROR]: 'errors.invalidRequest',
  [ErrorCode.SERVER_ERROR]: 'errors.serverError',
  [ErrorCode.UNKNOWN_ERROR]: 'errors.unknownError',
  [ErrorCode.INVALID_EMAIL]: 'errors.invalidEmail',
  [ErrorCode.EMAIL_REQUIRED]: 'errors.emailRequired',
  [ErrorCode.USERNAME_REQUIRED]: 'errors.usernameRequired',
  [ErrorCode.USER_NOT_FOUND]: 'errors.userNotFound',
  [ErrorCode.USER_EXISTS]: 'errors.userExists',
  [ErrorCode.INVALID_PASSWORD]: 'errors.invalidPassword',
  [ErrorCode.PASSWORD_TOO_SHORT]: 'errors.passwordTooShort',
  [ErrorCode.ROLE_NOT_FOUND]: 'errors.roleNotFound',
  [ErrorCode.PERMISSION_DENIED]: 'errors.permissionDenied',
  [ErrorCode.INVALID_REQUEST]: 'errors.invalidRequest',
  [ErrorCode.INVALID_CAPTCHA]: 'errors.invalidCaptcha',
};

// Message patterns for error matching
const messagePatterns: Array<{ keywords: string[]; key: string }> = [
  { keywords: ['email'], key: 'errors.invalidEmail' },
  { keywords: ['password'], key: 'errors.invalidPassword' },
  { keywords: ['captcha'], key: 'errors.invalidCaptcha' },
  { keywords: ['not found'], key: 'errors.userNotFound' },
  { keywords: ['permission', 'denied', 'forbidden'], key: 'errors.permissionDenied' },
  { keywords: ['exists', 'duplicate'], key: 'errors.userExists' },
  { keywords: ['network'], key: 'errors.networkError' },
];

const normalizeCode = (code: string): string => code.toUpperCase().split(' ').join('_');

const matchMessagePattern = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  for (const pattern of messagePatterns) {
    if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return pattern.key;
    }
  }
  return null;
};

const getKeyFromCode = (code: string): string | null => ErrorI18nKey[normalizeCode(code)] || null;

const getKeyFromObject = (obj: { code?: string; message?: string }): string | null => {
  if (obj.code) {
    const key = getKeyFromCode(obj.code);
    if (key) return key;
  }
  return obj.message ? matchMessagePattern(obj.message) : null;
};

/**
 * Get the i18n key for an error code or message
 */
export const getErrorI18nKey = (error: unknown): string => {
  if (error instanceof AppError) {
    return ErrorI18nKey[error.code] || 'errors.unknownError';
  }

  if (typeof error === 'object' && error !== null) {
    return getKeyFromObject(error as { code?: string; message?: string }) || 'errors.unknownError';
  }

  if (typeof error === 'string') {
    return getKeyFromCode(error) || 'errors.unknownError';
  }

  return 'errors.unknownError';
};

export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as Partial<ApiError>;
    return {
      code: apiError.code || ErrorCode.UNKNOWN_ERROR,
      message: apiError.message || ErrorMessage[ErrorCode.UNKNOWN_ERROR],
    };
  }

  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: ErrorMessage[ErrorCode.UNKNOWN_ERROR],
  };
};

export const getHttpErrorCode = (status: number): string => {
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status >= 400 && status < 500) return ErrorCode.VALIDATION_ERROR;
  if (status >= 500) return ErrorCode.SERVER_ERROR;
  return ErrorCode.UNKNOWN_ERROR;
};

export const handleError = (error: unknown, context?: string): ApiError => {
  const parsedError = parseApiError(error);
  
  logger.error(context ? `[${context}]` : '[Error]', parsedError);
  
  return parsedError;
};
