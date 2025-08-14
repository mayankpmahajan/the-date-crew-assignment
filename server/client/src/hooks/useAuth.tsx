import { useState, useCallback, useEffect } from 'react';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types based on API documentation
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
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
  user: { id: string; username: string } | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Added to track initialization state
}

// Safe localStorage helper functions
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Handle storage errors silently
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Handle storage errors silently
  }
};

const parseStoredUser = (storedUser: string | null): { id: string; username: string } | null => {
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    // Validate that it has the expected structure
    if (parsed && typeof parsed === 'object' && 'id' in parsed && 'username' in parsed) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const useAuth = (): UseAuthReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getStorageItem('access_token');
        const storedUserData = getStorageItem('user');

        if (storedToken) {
          setToken(storedToken);
          
          // Parse and validate user data
          const parsedUser = parseStoredUser(storedUserData);
          if (parsedUser) {
            setUser(parsedUser);
          } else {
            // If we have a token but invalid user data, clear everything
            removeStorageItem('access_token');
            removeStorageItem('user');
          }
        }
      } catch (err) {
        // Clear potentially corrupted data
        removeStorageItem('access_token');
        removeStorageItem('user');
        console.warn('Auth initialization error, cleared storage:', err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

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
        if (data.username) {
          throw new Error(data.username[0]);
        }
        throw new Error(data.error || data.detail || 'Login failed');
      }

      // Validate response structure
      if (!data.access_token || !data.user) {
        throw new Error('Invalid response from server');
      }

      // Store token and user data
      setStorageItem('access_token', data.access_token);
      setStorageItem('user', JSON.stringify(data));
      
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
    removeStorageItem('access_token');
    removeStorageItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return {
    login,
    logout,
    isAuthenticated: !!token && !!user,
    token,
    user,
    loading,
    error,
    isInitialized,
  };
};