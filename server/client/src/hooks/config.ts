// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  REFRESH_TOKEN: 'refresh_token', // For future use
} as const;

// API endpoints
export const ENDPOINTS = {
  LOGIN: '/login/',
  USERS: '/users/',
  MATCHES: '/matches/',
} as const;

// Default query parameters
export const DEFAULT_PARAMS = {
  USERS_LIMIT: 50,
  MATCHES_LIMIT: 10,
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Authentication required. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Match scoring ranges (based on API documentation)
export const MATCH_SCORING = {
  AGE_COMPATIBILITY: { MIN: 0, MAX: 20 },
  LOCATION_PROXIMITY: { MIN: 0, MAX: 15 },
  INTEREST_SIMILARITY: { MIN: 0, MAX: 20 },
  PROFILE_COMPLETENESS: { MIN: 0, MAX: 10 },
  ACTIVITY_LEVEL: { MIN: 0, MAX: 10 },
  CAREER_COMPATIBILITY: { MIN: 0, MAX: 10 },
  POPULARITY_FACTOR: { MIN: 0, MAX: 15 },
  TOTAL_MAX: 100,
} as const;

// Utility function to get full URL
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${cleanEndpoint}`;
};

// Utility function to get match score color/rating
export const getMatchScoreRating = (score: number): {
  rating: string;
  color: string;
  description: string;
} => {
  if (score >= 80) {
    return {
      rating: 'Excellent',
      color: '#10B981', // green-500
      description: 'Highly compatible match'
    };
  } else if (score >= 65) {
    return {
      rating: 'Very Good',
      color: '#3B82F6', // blue-500
      description: 'Strong compatibility'
    };
  } else if (score >= 50) {
    return {
      rating: 'Good',
      color: '#8B5CF6', // purple-500
      description: 'Good potential match'
    };
  } else if (score >= 35) {
    return {
      rating: 'Fair',
      color: '#F59E0B', // amber-500
      description: 'Some compatibility'
    };
  } else {
    return {
      rating: 'Poor',
      color: '#EF4444', // red-500
      description: 'Limited compatibility'
    };
  }
};
