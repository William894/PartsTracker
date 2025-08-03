import { useState, useCallback } from 'react';
import { ApiError } from '../interfaces/ApiError';

export interface ApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
}

export function useApiResult<T>(apiFunc: (...args: any[]) => Promise<T>): ApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
        const result = await apiFunc(...args);
        console.log("RESULT: ", result);
      setData(result);
    } catch (err: any) {
        console.log("ERROR: ", err);
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, execute };
}