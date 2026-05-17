'use client';

import { useCallback, useState } from 'react';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface FetchState {
  data: any;
  loading: boolean;
  error: Error | null;
}

export function useFetch(url: string, options?: FetchOptions) {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (body?: any) => {
      setState({ data: null, loading: true, error: null });

      try {
        const fetchOptions: RequestInit = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        };

        if (body) {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    [url, options]
  );

  return { ...state, fetchData };
}
