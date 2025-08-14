import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useUsers, User } from './useUsers';
import { useMatches, Match, MatchesQueryParams } from './useMatches';

// Dashboard statistics type
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  successfulMatches: number;
  averageMatchScore: number;
}

// Combined dashboard data type
export interface DashboardData {
  matchmaker: {
    id: number;
    username: string;
  } | null;
  users: User[];
  stats: DashboardStats;
  recentMatches: Match[];
}

interface UseDashboardReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getMatchesForUser: (userId: number, limit?: number) => Promise<Match[]>;
  searchUsers: (query: string) => User[];
  getUserById: (userId: number) => User | undefined;
  isInitialized: boolean;
}

export const useDashboard = (): UseDashboardReturn => {
  const { isAuthenticated, user: authUser } = useAuth();
  const { 
    users, 
    matchmaker, 
    totalUsers, 
    loading: usersLoading, 
    error: usersError, 
    fetchUsers 
  } = useUsers(isAuthenticated);
  
  const { fetchMatches, loading: matchesLoading, error: matchesError } = useMatches();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    successfulMatches: 0,
    averageMatchScore: 0,
  });
  
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate dashboard statistics
  const calculateStats = useCallback((usersList: User[]): DashboardStats => {
    const totalUsers = usersList.length;
    
    // Calculate active users (users created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = usersList.filter(user => 
      new Date(user.created_at) > thirtyDaysAgo
    ).length;

    return {
      totalUsers,
      activeUsers,
      totalMatches: 0, // Will be updated when we fetch matches
      successfulMatches: 0, // Placeholder for future implementation
      averageMatchScore: 0, // Will be calculated from recent matches
    };
  }, []);

  // Get matches for a specific user
  const getMatchesForUser = useCallback(async (userId: number, limit: number = 10): Promise<Match[]> => {
    try {
      const response = await fetchMatches({ id: userId, limit });
      return response.matches;
    } catch (error) {
      console.error('Error fetching matches for user:', error);
      return [];
    }
  }, [fetchMatches]);

  // Search users by name, email, or other criteria
  const searchUsers = useCallback((query: string): User[] => {
    if (!query.trim()) return users;
    
    const searchTerm = query.toLowerCase();
    return users.filter(user => 
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.city.toLowerCase().includes(searchTerm) ||
      user.current_company.toLowerCase().includes(searchTerm)
    );
  }, [users]);

  // Get user by ID
  const getUserById = useCallback((userId: number): User | undefined => {
    return users.find(user => user.id === userId);
  }, [users]);

  // Fetch recent matches for dashboard overview
  const fetchRecentMatches = useCallback(async () => {
    if (users.length === 0) return;

    try {
      // Get matches for the first few users to show recent activity
      const sampleUsers = users.slice(0, 3);
      const matchesPromises = sampleUsers.map(user => 
        getMatchesForUser(user.id, 3)
      );
      
      const allMatches = await Promise.all(matchesPromises);
      const flatMatches = allMatches.flat();
      
      // Sort by match score and take top matches
      const topMatches = flatMatches
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 10);
      
      setRecentMatches(topMatches);
      
      // Update average match score in stats
      if (topMatches.length > 0) {
        const averageScore = topMatches.reduce((sum, match) => sum + match.match_score, 0) / topMatches.length;
        setStats(prev => ({
          ...prev,
          totalMatches: flatMatches.length,
          averageMatchScore: Math.round(averageScore * 100) / 100,
        }));
      }
    } catch (error) {
      console.error('Error fetching recent matches:', error);
    }
  }, [users, getMatchesForUser]);

  // Refresh all dashboard data
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await fetchUsers();
      // fetchRecentMatches will be called in useEffect when users update
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }, [isAuthenticated, fetchUsers]);

  // Update stats when users change
  useEffect(() => {
    if (users.length > 0) {
      const newStats = calculateStats(users);
      setStats(prev => ({ ...prev, ...newStats }));
      setIsInitialized(true);
      
      // Fetch recent matches in background
      fetchRecentMatches();
    }
  }, [users, calculateStats, fetchRecentMatches]);

  // Combine all data
  const data: DashboardData = {
    matchmaker: matchmaker || authUser,
    users,
    stats: {
      ...stats,
      totalUsers,
    },
    recentMatches,
  };

  const loading = usersLoading || matchesLoading;
  const error = usersError || matchesError;

  return {
    data,
    loading,
    error,
    refreshData,
    getMatchesForUser,
    searchUsers,
    getUserById,
    isInitialized,
  };
};
