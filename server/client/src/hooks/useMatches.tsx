import { useState, useCallback } from 'react';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types based on API documentation
export interface Match {
  id: number;
  name: string;
  age: number;
  gender: string;
  city: string;
  first_name: string;
  last_name: string;
  country: string;
  height: number;
  email: string;
  phone_number: string;
  undergraduate_college: string;
  degree: string;
  current_company: string;
  designation: string;
  marital_status: string;
  match_score: number;
  compatibility_reasons: string[];
  distance_km: number | null;
  profile_completeness: number;
}

export interface TargetUser {
  id: number;
  name: string;
  age: number;
  gender: string;
  interested_in: string | null;
}

export interface MatchesResponse {
  status: 'success';
  target_user: TargetUser;
  total_potential_matches: number;
  returned_matches: number;
  matches: Match[];
}

export interface MatchesQueryParams {
  id: number; // Required: User ID to find matches for
  limit?: number; // Optional: Number of matches to return
}

interface UseMatchesReturn {
  matches: Match[];
  targetUser: TargetUser | null;
  totalPotentialMatches: number;
  returnedMatches: number;
  loading: boolean;
  error: string | null;
  fetchMatches: (params: MatchesQueryParams) => Promise<MatchesResponse>;
  clearMatches: () => void;
}

export const useMatches = (): UseMatchesReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [totalPotentialMatches, setTotalPotentialMatches] = useState(0);
  const [returnedMatches, setReturnedMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async (params: MatchesQueryParams): Promise<MatchesResponse> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append('id', params.id.toString());
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `${API_BASE_URL}/matches/?${queryParams.toString()}`;

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
        if (data.status === 'error') {
          throw new Error(data.error);
        }
        throw new Error(data.detail || 'Failed to fetch matches');
      }

      // Update state with response data
      setMatches(data.matches);
      setTargetUser(data.target_user);
      setTotalPotentialMatches(data.total_potential_matches);
      setReturnedMatches(data.returned_matches);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch matches';
      setError(errorMessage);
      console.error('Matches fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMatches = useCallback(() => {
    setMatches([]);
    setTargetUser(null);
    setTotalPotentialMatches(0);
    setReturnedMatches(0);
    setError(null);
  }, []);

  return {
    matches,
    targetUser,
    totalPotentialMatches,
    returnedMatches,
    loading,
    error,
    fetchMatches,
    clearMatches,
  };
};