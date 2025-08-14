"use client"

import React from 'react'
import AdminSidebar from './AdminSidebar'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
  return (
    <div className="flex h-screen bg-pink-25">
      <AdminSidebar />
      <main className={cn(
        "flex-1 overflow-auto bg-gradient-to-br from-pink-25 to-rose-25",
        className
      )}>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
