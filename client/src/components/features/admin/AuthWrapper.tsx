// AuthWrapper.tsx - Updated to work with the fixed useAuth hook
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface AuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}) => {
  const { isAuthenticated, isInitialized, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're done initializing and not authenticated
    if (isInitialized && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isInitialized, router])

  // Show loading while initializing authentication state
  if (!isInitialized) {
    return <>{fallback}</>
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null
  }

  // Show protected content
  return <>{children}</>
}

export default AuthWrapper