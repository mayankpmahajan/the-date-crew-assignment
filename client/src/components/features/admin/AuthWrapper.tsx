"use client"

import React, { useEffect } from 'react'
import { useAuth, useApiErrorHandler } from '@/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { 
    isAuthenticated, 
    login, 
    loading, 
    error: authError 
  } = useAuth()
  
  const { 
    errors, 
    notifications, 
    handleApiError,
    clearError,
    clearNotification 
  } = useApiErrorHandler()

  const [credentials, setCredentials] = React.useState({
    username: 'raju123',
    password: 'secure123'
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(credentials)
    } catch (error) {
      handleApiError(error)
    }
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white border-pink-200 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-pink-900 mb-2">Admin Login</h1>
            <p className="text-pink-600">Sign in to access the dashboard</p>
          </div>

          {/* Display errors */}
          {errors.map(error => (
            <div key={error.id} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error.message}</span>
              </div>
              <button 
                onClick={() => clearError(error.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Username
              </label>
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                placeholder="Enter password"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-pink-600">
            <p>Default credentials:</p>
            <p>Username: <code className="bg-pink-100 px-1 rounded">raju123</code></p>
            <p>Password: <code className="bg-pink-100 px-1 rounded">secure123</code></p>
          </div>
        </Card>
      </div>
    )
  }

  // Show authenticated content with error notifications
  return (
    <div className="relative">
      {/* Global notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] ${
              notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
              notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
              notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
              'bg-blue-50 border border-blue-200 text-blue-700'
            }`}
          >
            <span className="text-sm">{notification.message}</span>
            {notification.persistent && (
              <button 
                onClick={() => clearNotification(notification.id)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Global errors */}
      {errors.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          {errors.map(error => (
            <div key={error.id} className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between min-w-[300px]">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error.message}</span>
              </div>
              <button 
                onClick={() => clearError(error.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  )
}

export default AuthWrapper
