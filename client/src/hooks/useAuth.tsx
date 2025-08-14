import { useState, useCallback } from 'react';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types based on API documentation
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: 'success';
  message: string;
  user: {
    id: number;
    username: string;
  };
  access_token: string;
}

export interface ApiError {
  error?: string;
  status?: 'error';
  detail?: string;
  [key: string]: any; // For validation errors
}

interface UseAuthReturn {
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  user: LoginResponse['user'] | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [token, setToken] = useState<string | null>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  );
  const [user, setUser] = useState<LoginResponse['user'] | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.password) {
          throw new Error(data.password[0]);
        }
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setToken(data.access_token);
      setUser(data.user);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return {
    login,
    logout,
    isAuthenticated: !!token,
    token,
    user,
    loading,
    error,
  };
};
