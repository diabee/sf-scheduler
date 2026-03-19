import { useCallback, useEffect, useState } from 'react';
import { handleError } from '~/utils/error';
import type { ApiError } from '~/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

const DEFAULT_OPTIONS: UseApiOptions = { immediate: true };

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = DEFAULT_OPTIONS
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = handleError(err, 'useApi');
      setState(prev => ({ ...prev, loading: false, error }));
      return null;
    }
  }, [fetcher]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

export function useApiMutation<T, P = void>(
  mutator: (params: P) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await mutator(params);
      setState({ data, loading: false, error: null });
      return { data, error: null };
    } catch (err) {
      const error = handleError(err, 'useApiMutation');
      setState(prev => ({ ...prev, loading: false, error }));
      return { data: null, error };
    }
  }, [mutator]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
