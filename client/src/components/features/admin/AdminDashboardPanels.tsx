"use client"

import React from 'react'
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
import { useDashboard } from '@/hooks'

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

const AdminDashboardPanels: React.FC = () => {
  const { data, loading, error } = useDashboard()

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

  const dashboardStats = [
    {
      icon: Users,
      title: 'Total Users',
      value: data.stats.totalUsers || 0,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      icon: Heart,
      title: 'Active Matches',
      value: data.stats.totalMatches || 0,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      icon: UserCheck,
      title: 'Active Users',
      value: data.stats.activeUsers || 0,
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      icon: MessageSquare,
      title: 'Successful Matches',
      value: data.stats.successfulMatches || 0,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      icon: Star,
      title: 'Avg Match Score',
      value: `${data.stats.averageMatchScore.toFixed(1)}/10` || '0/10',
      change: '+3%',
      changeType: 'positive' as const
    },
    {
      icon: Activity,
      title: 'Daily Active',
      value: '1,892',
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
