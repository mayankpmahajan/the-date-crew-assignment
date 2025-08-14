import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// Types for dashboard data
export interface DashboardStats {
  totalUsers: number;
  totalMatches: number;
  activeUsers: number;
  successfulMatches: number;
  averageMatchScore: number;
}

export interface DashboardData {
  stats: DashboardStats;
}

interface UseDashboardReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Default/fallback data
const defaultDashboardData: DashboardData = {
  stats: {
    totalUsers: 0,
    totalMatches: 0,
    activeUsers: 0,
    successfulMatches: 0,
    averageMatchScore: 0
  }
};

export const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData>(defaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/dashboard/stats/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const dashboardData = await response.json();
      
      // Validate the response structure and provide defaults
      const validatedData: DashboardData = {
        stats: {
          totalUsers: dashboardData.stats?.totalUsers || dashboardData.total_users || 0,
          totalMatches: dashboardData.stats?.totalMatches || dashboardData.total_matches || 0,
          activeUsers: dashboardData.stats?.activeUsers || dashboardData.active_users || 0,
          successfulMatches: dashboardData.stats?.successfulMatches || dashboardData.successful_matches || 0,
          averageMatchScore: dashboardData.stats?.averageMatchScore || dashboardData.average_match_score || 0
        }
      };

      setData(validatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
      
      // Use mock data when API fails (for development)
      setData({
        stats: {
          totalUsers: 2547,
          totalMatches: 1832,
          activeUsers: 1245,
          successfulMatches: 387,
          averageMatchScore: 8.4
        }
      });
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [fetchDashboardData, isAuthenticated]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};