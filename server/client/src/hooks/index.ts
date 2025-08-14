// Authentication hooks
export { useAuth } from './useAuth';
export type { LoginRequest, LoginResponse, ApiError } from './useAuth';

// Users management hooks
export { useUsers } from './useUsers';
export type { User, UsersResponse, UsersQueryParams } from './useUsers';

// Matches hooks
export { useMatches } from './useMatches';
export type { 
  Match, 
  TargetUser, 
  MatchesResponse, 
  MatchesQueryParams 
} from './useMatches';

// General API hooks
export { useApi, useApiGet, useApiPost } from './useApi';
export type { ApiResponse, ApiRequestOptions } from './useApi';

// Dashboard hooks
export { useDashboard } from './useDashboard';
export type { DashboardStats, DashboardData } from './useDashboard';

// Error handling hooks
export { 
  useErrorHandler, 
  useApiErrorHandler, 
  useAutoErrorCleanup 
} from './useErrorHandler';
export type { AppError, Notification } from './useErrorHandler';

// Configuration and utilities
export * from './config';
