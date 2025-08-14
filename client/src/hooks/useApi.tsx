import { useState, useCallback, useEffect } from 'react';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Generic types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  detail?: string;
  [key: string]: any;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

interface UseApiReturn {
  loading: boolean;
  error: string | null;
  request: <T = any>(endpoint: string, options?: ApiRequestOptions) => Promise<T>;
  clearError: () => void;
}

export const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T = any>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const {
      method = 'GET',
      body,
      headers = {},
      requireAuth = true,
    } = options;

    setLoading(true);
    setError(null);

    try {
      // Prepare headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };

      // Add authentication if required
      if (requireAuth) {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      // Prepare request configuration
      const config: RequestInit = {
        method,
        headers: requestHeaders,
      };

      // Add body for non-GET requests
      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      // Make the request
      const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const response = await fetch(url, config);
      
      // Parse response
      const data = await response.json();

      // Handle errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        if (data.status === 'error') {
          throw new Error(data.error);
        }
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      setError(errorMessage);
      console.error('API request error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    clearError,
  };
};

// Utility hooks for specific operations
export const useApiGet = <T = any>(endpoint: string, autoFetch: boolean = false) => {
  const { request, loading, error, clearError } = useApi();
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await request<T>(endpoint);
      setData(result);
      return result;
    } catch (err) {
      setData(null);
      throw err;
    }
  }, [request, endpoint]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    clearError,
    refetch: fetchData,
  };
};

export const useApiPost = <TRequest = any, TResponse = any>() => {
  const { request, loading, error, clearError } = useApi();

  const postData = useCallback(async (
    endpoint: string, 
    body: TRequest, 
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<TResponse> => {
    return request<TResponse>(endpoint, {
      method: 'POST',
      body,
      ...options,
    });
  }, [request]);

  return {
    postData,
    loading,
    error,
    clearError,
  };
};
