"use client"

import React from 'react'
import AuthWrapper from '@/components/features/admin/AuthWrapper'
import AdminLayout from '@/components/features/admin/AdminLayout'
import AdminHeader from '@/components/features/admin/AdminHeader'
import AdminDashboardPanels from '@/components/features/admin/AdminDashboardPanels'
import { Card } from '@/components/ui/card'
import { 
  Calendar,
  TrendingUp,
  Users,
  Heart
} from 'lucide-react'

const AdminDashboard = () => {
  return (

      <AdminLayout>
      <div className="p-6">
        <AdminHeader />
        
        {/* Main Stats */}
        <AdminDashboardPanels />
        
        {/* Additional Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="p-6 bg-gradient-to-br from-white to-pink-50 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pink-900">Recent Activity</h3>
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <div className="space-y-3">
              {[
                { user: 'Alice Johnson', action: 'Created new profile', time: '2 minutes ago' },
                { user: 'Bob Smith', action: 'Matched with Sarah', time: '5 minutes ago' },
                { user: 'Emma Davis', action: 'Updated profile photo', time: '12 minutes ago' },
                { user: 'Mike Wilson', action: 'Sent first message', time: '18 minutes ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-pink-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-pink-900">{activity.user}</p>
                    <p className="text-xs text-pink-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-pink-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Matches This Week */}
          <Card className="p-6 bg-gradient-to-br from-white to-pink-50 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pink-900">Top Matches This Week</h3>
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div className="space-y-3">
              {[
                { couple: 'Alex & Jamie', compatibility: '98%', status: 'Messaging' },
                { couple: 'Sam & Taylor', compatibility: '95%', status: 'First Date' },
                { couple: 'Chris & Jordan', compatibility: '92%', status: 'Messaging' },
                { couple: 'Riley & Casey', compatibility: '89%', status: 'New Match' },
              ].map((match, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-pink-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-pink-900">{match.couple}</p>
                    <p className="text-xs text-pink-600">{match.compatibility} compatibility</p>
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    {match.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Weekly Stats Chart Placeholder */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-white to-pink-50 border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pink-900">Weekly Overview</h3>
            <Calendar className="w-5 h-5 text-pink-600" />
          </div>
          <div className="h-64 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
            <p className="text-pink-600">Chart visualization would go here</p>
          </div>
        </Card>
      </div>
    </AdminLayout>

  )
}

export default AdminDashboard