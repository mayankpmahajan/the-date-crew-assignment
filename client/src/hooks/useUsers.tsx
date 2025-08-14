import { useState, useEffect, useCallback } from 'react';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types based on API documentation
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  matchmaker: number;
  matchmaker_info: {
    id: number;
    username: string;
  };
  country: string;
  city: string;
  height: number;
  email: string;
  phone_number: string;
  undergraduate_college: string;
  degree: string;
  income: string;
  current_company: string;
  designation: string;
  marital_status: string;
  languages_known: number[];
  siblings: number;
  caste: string;
  religion: string;
  want_kids: string;
  open_to_relocate: string;
  open_to_pets: string;
  created_at: string;
  updated_at: string;
  age: number;
}

export interface UsersResponse {
  status: 'success';
  matchmaker: {
    id: number;
    username: string;
  };
  total_users: number;
  data: User[];
}

export interface UsersQueryParams {
  limit?: number;
}

interface UseUsersReturn {
  users: User[];
  matchmaker: UsersResponse['matchmaker'] | null;
  totalUsers: number;
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: UsersQueryParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUsers = (autoFetch: boolean = true): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [matchmaker, setMatchmaker] = useState<UsersResponse['matchmaker'] | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<UsersQueryParams>({});

  const fetchUsers = useCallback(async (params: UsersQueryParams = {}) => {
    setLoading(true);
    setError(null);
    setLastParams(params);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query string
      const queryParams = new URLSearchParams();
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `${API_BASE_URL}/users/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(data.error || data.detail || 'Failed to fetch users');
      }

      setUsers(data.data);
      setMatchmaker(data.matchmaker);
      setTotalUsers(data.total_users);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchUsers(lastParams);
  }, [fetchUsers, lastParams]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    users,
    matchmaker,
    totalUsers,
    loading,
    error,
    fetchUsers,
    refetch,
  };
};
