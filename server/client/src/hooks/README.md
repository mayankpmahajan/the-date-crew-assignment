# API Hooks Documentation

This directory contains React hooks for interacting with The Date Crew API. All hooks are TypeScript-enabled and follow React best practices.

## Overview

### Available Hooks

1. **`useAuth`** - Authentication management
2. **`useUsers`** - User data fetching and management
3. **`useMatches`** - Match finding and scoring
4. **`useApi`** - General API requests
5. **`useDashboard`** - Combined dashboard data
6. **`useErrorHandler`** - Error and notification management

## Usage Examples

### Authentication

```tsx
import { useAuth } from '@/hooks';

function LoginForm() {
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // User is now authenticated
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome back!</p>
      ) : (
        <form onSubmit={handleLogin}>
          {/* Login form */}
        </form>
      )}
    </div>
  );
}
```

### Users Management

```tsx
import { useUsers } from '@/hooks';

function UsersList() {
  const { 
    users, 
    totalUsers, 
    loading, 
    error, 
    fetchUsers 
  } = useUsers();

  const handleLoadMore = () => {
    fetchUsers({ limit: 20 });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({totalUsers})</h2>
      {users.map(user => (
        <div key={user.id}>
          {user.first_name} {user.last_name}
        </div>
      ))}
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
}
```

### Matches

```tsx
import { useMatches } from '@/hooks';

function MatchesList({ userId }: { userId: number }) {
  const { 
    matches, 
    targetUser, 
    totalPotentialMatches,
    loading, 
    error,
    fetchMatches 
  } = useMatches();

  useEffect(() => {
    fetchMatches({ id: userId, limit: 10 });
  }, [userId]);

  if (loading) return <div>Finding matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Matches for {targetUser?.name}</h2>
      <p>{totalPotentialMatches} potential matches found</p>
      {matches.map(match => (
        <div key={match.id}>
          <h3>{match.name}</h3>
          <p>Score: {match.match_score}/100</p>
          <p>Age: {match.age}</p>
          <p>Reasons: {match.compatibility_reasons.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

### Dashboard

```tsx
import { useDashboard } from '@/hooks';

function Dashboard() {
  const { 
    data, 
    loading, 
    error, 
    refreshData,
    searchUsers,
    getMatchesForUser 
  } = useDashboard();

  const handleRefresh = () => {
    refreshData();
  };

  const handleUserSearch = (query: string) => {
    const results = searchUsers(query);
    // Handle search results
  };

  const viewMatches = async (userId: number) => {
    const matches = await getMatchesForUser(userId, 5);
    // Handle matches
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div>
        <h2>Statistics</h2>
        <p>Total Users: {data.stats.totalUsers}</p>
        <p>Active Users: {data.stats.activeUsers}</p>
        <p>Average Match Score: {data.stats.averageMatchScore}</p>
      </div>

      <div>
        <h2>Recent Matches</h2>
        {data.recentMatches.map(match => (
          <div key={match.id}>
            {match.name} - {match.match_score}%
          </div>
        ))}
      </div>

      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}
```

### Error Handling

```tsx
import { useApiErrorHandler } from '@/hooks';

function MyComponent() {
  const { 
    errors,
    notifications,
    handleApiError,
    showSuccessMessage,
    clearError 
  } = useApiErrorHandler();

  const handleApiCall = async () => {
    try {
      // Make API call
      const result = await someApiCall();
      showSuccessMessage('Operation completed successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div>
      {/* Display errors */}
      {errors.map(error => (
        <div key={error.id} className="error">
          {error.message}
          <button onClick={() => clearError(error.id)}>×</button>
        </div>
      ))}

      {/* Display notifications */}
      {notifications.map(notification => (
        <div key={notification.id} className={notification.type}>
          {notification.message}
        </div>
      ))}

      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  );
}
```

### General API Requests

```tsx
import { useApi } from '@/hooks';

function CustomApiComponent() {
  const { request, loading, error } = useApi();

  const handleCustomRequest = async () => {
    try {
      const data = await request('/custom-endpoint', {
        method: 'POST',
        body: { key: 'value' },
      });
      // Handle response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <button 
        onClick={handleCustomRequest} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Make Request'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Hook Details

### `useAuth`

**Purpose**: Manage user authentication state and operations.

**Returns**:
- `login(credentials)` - Authenticate user
- `logout()` - Clear authentication
- `isAuthenticated` - Boolean authentication status
- `token` - Current JWT token
- `user` - Current user data
- `loading` - Loading state
- `error` - Error message

### `useUsers`

**Purpose**: Fetch and manage user data.

**Parameters**:
- `autoFetch` (optional) - Auto-fetch on mount

**Returns**:
- `users` - Array of users
- `matchmaker` - Current matchmaker info
- `totalUsers` - Total user count
- `loading` - Loading state
- `error` - Error message
- `fetchUsers(params)` - Fetch users with parameters
- `refetch()` - Refetch with last parameters

### `useMatches`

**Purpose**: Find and manage matches for users.

**Returns**:
- `matches` - Array of matches
- `targetUser` - User being matched
- `totalPotentialMatches` - Total possible matches
- `returnedMatches` - Number of returned matches
- `loading` - Loading state
- `error` - Error message
- `fetchMatches(params)` - Fetch matches for user
- `clearMatches()` - Clear current matches

### `useDashboard`

**Purpose**: Provide combined dashboard data and utilities.

**Returns**:
- `data` - Combined dashboard data
- `loading` - Loading state
- `error` - Error message
- `refreshData()` - Refresh all data
- `getMatchesForUser(userId, limit)` - Get matches for specific user
- `searchUsers(query)` - Search users by query
- `getUserById(userId)` - Get user by ID
- `isInitialized` - Initialization status

### `useErrorHandler`

**Purpose**: Manage errors and notifications.

**Returns**:
- `errors` - Array of errors
- `notifications` - Array of notifications
- `addError(message, code)` - Add error
- `addNotification(notification)` - Add notification
- `clearError(id)` - Clear specific error
- `clearNotification(id)` - Clear specific notification
- `clearAllErrors()` - Clear all errors
- `clearAllNotifications()` - Clear all notifications

## Configuration

API configuration is managed in `config.ts`:

```tsx
import { API_CONFIG, ENDPOINTS } from '@/hooks';

// Base URL
console.log(API_CONFIG.BASE_URL); // http://localhost:8000/api/v1

// Endpoints
console.log(ENDPOINTS.LOGIN); // /login/
console.log(ENDPOINTS.USERS); // /users/
console.log(ENDPOINTS.MATCHES); // /matches/
```

## Best Practices

1. **Error Handling**: Always handle errors in your components
2. **Loading States**: Show loading indicators during API calls
3. **Cleanup**: Clear data when components unmount if needed
4. **Optimization**: Use `autoFetch: false` for manual data fetching
5. **Type Safety**: Import types for better TypeScript support

## Integration Example

```tsx
// App.tsx
import { useAuth, useApiErrorHandler } from '@/hooks';

function App() {
  const { isAuthenticated } = useAuth();
  const { errors, notifications } = useApiErrorHandler();

  return (
    <div>
      {/* Error Display Component */}
      <ErrorBoundary errors={errors} notifications={notifications} />
      
      {/* Main App */}
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
}
```

This hooks system provides a complete abstraction layer over the API, making it easy to integrate with your React components while maintaining type safety and proper error handling.
