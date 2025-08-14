"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  Heart, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  className?: string
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: 'Overview', href: '/admin-dashboard' },
    { icon: Heart, label: 'Matches', href: '/admin-dashboard/matches' },
    { icon: Settings, label: 'Settings', href: '/admin-dashboard/settings' },
  ]

  const bottomItems = [
    { icon: User, label: 'Profile', href: '/admin-dashboard/profile' },
    { icon: LogOut, label: 'Logout', href: '/logout' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin-dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={cn(
      "flex flex-col bg-gradient-to-b from-pink-50 to-rose-50 border-r border-pink-200 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-pink-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-pink-900">DateCrew</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 text-pink-600 hover:text-pink-800 hover:bg-pink-100"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Menu Items */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-pink-700 hover:text-pink-900 hover:bg-pink-100 transition-colors",
                isCollapsed ? "px-2" : "px-4",
                isActive(item.href) && "bg-pink-100 text-pink-900 font-medium"
              )}
            >
              <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="p-2 space-y-1 border-t border-pink-200">
        {bottomItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-pink-700 hover:text-pink-900 hover:bg-pink-100 transition-colors",
                isCollapsed ? "px-2" : "px-4",
                isActive(item.href) && "bg-pink-100 text-pink-900 font-medium"
              )}
            >
              <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminSidebar
