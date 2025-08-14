"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar,
  UserCheck,
  MessageSquare,
  Star,
  Activity,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  className 
}) => {
  return (
    <Card className={cn(
      "p-4 bg-gradient-to-br from-white to-pink-50 border-pink-200 hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg">
            <Icon className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-pink-900">{title}</p>
            <p className="text-2xl font-bold text-pink-800">{value}</p>
          </div>
        </div>
        {change && (
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            changeType === 'positive' && "bg-green-100 text-green-700",
            changeType === 'negative' && "bg-red-100 text-red-700",
            changeType === 'neutral' && "bg-pink-100 text-pink-700"
          )}>
            {change}
          </div>
        )}
      </div>
    </Card>
  )
}

interface User {
  id: number
  first_name: string
  last_name: string
  gender: string
  date_of_birth: string
  matchmaker: number
  matchmaker_info: {
    id: number
    username: string
  }
  country: string
  city: string
  height: number
  email: string
  phone_number: string
  undergraduate_college: string
  degree: string
  income: string
  current_company: string
  designation: string
  marital_status: string
  languages_known: number[]
  siblings: number
  caste: string
  religion: string
  want_kids: string
  open_to_relocate: string
  open_to_pets: string
  created_at: string
  updated_at: string
  age: number
}

interface ApiResponse {
  status: string
  matchmaker: {
    id: number
    username: string
  }
  total_users: number
  data: User[]
}

const AdminDashboardPanels: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('http://localhost:8000/api/v1/users/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: ApiResponse = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 bg-gradient-to-br from-white to-pink-50 border-pink-200">
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <Card className="col-span-full p-4 bg-red-50 border-red-200">
          <div className="text-red-700 text-center">
            Failed to load dashboard stats: {error}
          </div>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <Card className="col-span-full p-4 bg-gray-50 border-gray-200">
          <div className="text-gray-700 text-center">
            No data available
          </div>
        </Card>
      </div>
    )
  }

  // Calculate statistics from the data
  const totalUsers = data.total_users
  const activeUsers = data.data.filter(user => user.marital_status !== 'married').length
  const maleUsers = data.data.filter(user => user.gender === 'male').length
  const femaleUsers = data.data.filter(user => user.gender === 'female').length
  const otherUsers = data.data.filter(user => user.gender === 'other').length
  
  // Calculate average age
  const averageAge = data.data.length > 0 
    ? (data.data.reduce((sum, user) => sum + user.age, 0) / data.data.length).toFixed(1)
    : 0

  // Calculate users wanting kids
  const usersWantingKids = data.data.filter(user => user.want_kids === 'yes').length

  const dashboardStats = [
    {
      icon: Users,
      title: 'Total Users',
      value: totalUsers,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      icon: Heart,
      title: 'Active Matches',
      value: maleUsers + femaleUsers, // Potential matches between males and females
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      icon: UserCheck,
      title: 'Active Users',
      value: activeUsers,
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      icon: MessageSquare,
      title: 'Want Kids',
      value: usersWantingKids,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      icon: Star,
      title: 'Avg Age',
      value: `${averageAge} years`,
      change: '+3%',
      changeType: 'positive' as const
    },
    {
      icon: Activity,
      title: 'Daily Active',
      value: Math.floor(activeUsers * 0.6), // Estimated daily active as 60% of active users
      change: '+7%',
      changeType: 'positive' as const
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {dashboardStats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
        />
      ))}
    </div>
  )
}

export default AdminDashboardPanels