import { useState, useCallback, useEffect } from 'react';

// Error types
export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  code?: string;
  timestamp: number;
  id: string;
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
  persistent?: boolean;
  timestamp: number;
}

interface UseErrorHandlerReturn {
  errors: AppError[];
  notifications: Notification[];
  addError: (message: string, code?: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearError: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllErrors: () => void;
  clearAllNotifications: () => void;
  hasErrors: boolean;
  hasNotifications: boolean;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errors, setErrors] = useState<AppError[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add error
  const addError = useCallback((message: string, code?: string) => {
    const error: AppError = {
      id: generateId(),
      message,
      type: 'error',
      code,
      timestamp: Date.now(),
    };
    
    setErrors(prev => [...prev, error]);
  }, [generateId]);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      const duration = notification.duration || 5000; // Default 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, duration);
    }
  }, [generateId]);

  // Clear specific error
  const clearError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  // Clear specific notification
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    errors,
    notifications,
    addError,
    addNotification,
    clearError,
    clearNotification,
    clearAllErrors,
    clearAllNotifications,
    hasErrors: errors.length > 0,
    hasNotifications: notifications.length > 0,
  };
};

// Hook for handling API errors specifically
interface UseApiErrorHandlerReturn {
  handleApiError: (error: any) => void;
  showSuccessMessage: (message: string) => void;
  showInfoMessage: (message: string) => void;
  showWarningMessage: (message: string) => void;
}

export const useApiErrorHandler = (): UseApiErrorHandlerReturn & UseErrorHandlerReturn => {
  const errorHandler = useErrorHandler();

  // Handle API errors with proper message extraction
  const handleApiError = useCallback((error: any) => {
    let message = 'An unexpected error occurred';
    let code: string | undefined;

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.response?.data) {
      // Handle axios-style errors
      const data = error.response.data;
      if (data.error) {
        message = data.error;
      } else if (data.detail) {
        message = data.detail;
      } else if (data.message) {
        message = data.message;
      }
      code = error.response.status?.toString();
    } else if (error?.status === 'error' && error?.error) {
      // Handle API error responses
      message = error.error;
    }

    errorHandler.addError(message, code);
  }, [errorHandler]);

  // Show success message
  const showSuccessMessage = useCallback((message: string) => {
    errorHandler.addNotification({
      message,
      type: 'success',
      duration: 3000,
    });
  }, [errorHandler]);

  // Show info message
  const showInfoMessage = useCallback((message: string) => {
    errorHandler.addNotification({
      message,
      type: 'info',
      duration: 4000,
    });
  }, [errorHandler]);

  // Show warning message
  const showWarningMessage = useCallback((message: string) => {
    errorHandler.addNotification({
      message,
      type: 'warning',
      duration: 5000,
    });
  }, [errorHandler]);

  return {
    ...errorHandler,
    handleApiError,
    showSuccessMessage,
    showInfoMessage,
    showWarningMessage,
  };
};

// Hook for automatic error cleanup
export const useAutoErrorCleanup = (maxAge: number = 30000) => { // 30 seconds
  const { errors, clearError } = useErrorHandler();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      errors.forEach(error => {
        if (now - error.timestamp > maxAge) {
          clearError(error.id);
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [errors, clearError, maxAge]);
};
