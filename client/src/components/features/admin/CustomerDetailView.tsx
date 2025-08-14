"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Users,
  Calendar,
  Globe,
  Award,
  DollarSign,
  Edit,
  MessageSquare
} from 'lucide-react'
import { Customer } from '@/types/customer'
import { cn } from '@/lib/utils'

interface CustomerDetailViewProps {
  customer: Customer
  onClose: () => void
  onEdit?: (customer: Customer) => void
  onMessage?: (customer: Customer) => void
}

const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  customer,
  onClose,
  onEdit,
  onMessage
}) => {
  const InfoSection = ({ 
    title, 
    icon: Icon, 
    children 
  }: { 
    title: string
    icon: React.ElementType
    children: React.ReactNode 
  }) => (
    <Card className="p-4 border-pink-200 bg-gradient-to-br from-white to-pink-25">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-pink-100 rounded-lg">
          <Icon className="w-4 h-4 text-pink-600" />
        </div>
        <h3 className="font-medium text-pink-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </Card>
  )

  const InfoField = ({ label, value }: { label: string; value: string | number | string[] }) => (
    <div className="flex justify-between items-start">
      <span className="text-sm text-pink-600 font-medium">{label}:</span>
      <span className="text-sm text-pink-800 text-right">
        {Array.isArray(value) ? value.join(', ') : value}
      </span>
    </div>
  )

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      status === 'Active' && "bg-green-100 text-green-800",
      status === 'Matched' && "bg-blue-100 text-blue-800",
      status === 'Pending' && "bg-yellow-100 text-yellow-800",
      status === 'Inactive' && "bg-gray-100 text-gray-800"
    )}>
      {status}
    </span>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-pink-900">
                {customer.firstName} {customer.lastName}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={customer.statusTag} />
                <span className="text-sm text-pink-600">ID: {customer.id}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage?.(customer)}
              className="border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(customer)}
              className="border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Basic Information */}
            <InfoSection title="Basic Information" icon={User}>
              <InfoField label="Gender" value={customer.gender} />
              <InfoField label="Date of Birth" value={customer.dateOfBirth} />
              <InfoField label="Age" value={customer.age} />
              <InfoField label="Height" value={customer.height} />
              <InfoField label="Marital Status" value={customer.maritalStatus} />
            </InfoSection>

            {/* Contact Information */}
            <InfoSection title="Contact Information" icon={Mail}>
              <InfoField label="Email" value={customer.email} />
              <InfoField label="Phone" value={customer.phoneNumber} />
              <div className="flex justify-between items-start">
                <span className="text-sm text-pink-600 font-medium">Location:</span>
                <div className="text-right">
                  <div className="text-sm text-pink-800">{customer.city}</div>
                  <div className="text-xs text-pink-600">{customer.country}</div>
                </div>
              </div>
            </InfoSection>

            {/* Educational Background */}
            <InfoSection title="Education" icon={GraduationCap}>
              <InfoField label="College" value={customer.undergraduateCollege} />
              <InfoField label="Degree" value={customer.degree} />
            </InfoSection>

            {/* Professional Information */}
            <InfoSection title="Professional" icon={Briefcase}>
              <InfoField label="Company" value={customer.currentCompany} />
              <InfoField label="Designation" value={customer.designation} />
              <InfoField label="Income" value={`$${customer.income.toLocaleString()}`} />
            </InfoSection>

            {/* Family Information */}
            <InfoSection title="Family & Background" icon={Users}>
              <InfoField label="Siblings" value={customer.siblings} />
              <InfoField label="Caste" value={customer.caste} />
              <InfoField label="Religion" value={customer.religion} />
              <InfoField label="Languages" value={customer.languagesKnown} />
            </InfoSection>

            {/* Preferences */}
            <InfoSection title="Preferences" icon={Heart}>
              <InfoField label="Want Kids" value={customer.wantKids} />
              <InfoField label="Open to Relocate" value={customer.openToRelocate} />
              <InfoField label="Open to Pets" value={customer.openToPets} />
            </InfoSection>

          </div>

          {/* Additional Information Panel */}
          <Card className="mt-6 p-6 border-pink-200 bg-gradient-to-br from-pink-25 to-rose-25">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-pink-900">Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-pink-600 font-medium">Member Since:</span>
                <div className="text-sm text-pink-800">{customer.createdAt}</div>
              </div>
              <div>
                <span className="text-sm text-pink-600 font-medium">Profile Status:</span>
                <div className="text-sm text-pink-800">{customer.statusTag}</div>
              </div>
              <div>
                <span className="text-sm text-pink-600 font-medium">Customer ID:</span>
                <div className="text-sm text-pink-800">{customer.id}</div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default CustomerDetailView
