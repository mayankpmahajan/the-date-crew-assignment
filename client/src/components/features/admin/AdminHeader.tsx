"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Bell, 
  User,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title = "Dashboard Overview", 
  subtitle = "Welcome back! Here's what's happening with your dating platform.",
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
      className
    )}>
      <div>
        <h1 className="text-2xl font-bold text-pink-900">{title}</h1>
        <p className="text-sm text-pink-600 mt-1">{subtitle}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64 bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-200 text-sm"
          />
        </div>

        {/* Quick Actions */}
        <Button
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
        >
          <Bell className="w-5 h-5" />
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          size="sm"
          className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export default AdminHeader
