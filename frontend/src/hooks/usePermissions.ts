import { useState, useEffect, useCallback } from 'react';
import { apiService } from '~/services/api';
import { logger } from '~/configs/env';
import type { UserPermissionsDTO } from '~/types';

interface UsePermissionsResult {
  permissions: UserPermissionsDTO | null;
  loading: boolean;
  error: string | null;
  hasPermission: (code: string) => boolean;
  hasRole: (role: string) => boolean;
  refresh: () => Promise<void>;
}

export function usePermissions(): UsePermissionsResult {
  const [permissions, setPermissions] = useState<UserPermissionsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserPermissions();
      setPermissions(data);
    } catch (err) {
      logger.error('Failed to fetch permissions:', err);
      setError('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback((code: string): boolean => {
    if (!permissions) return false;
    // Check if user has the specific permission
    return permissions.permissions.includes(code);
  }, [permissions]);

  const hasRole = useCallback((role: string): boolean => {
    if (!permissions) return false;
    return permissions.roles.includes(role);
  }, [permissions]);

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasRole,
    refresh: fetchPermissions,
  };
}

