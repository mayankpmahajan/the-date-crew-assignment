"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/features/admin/AdminLayout'
import CustomerTable from '@/components/features/admin/CustomerTable'
import CustomerDetailView from '@/components/features/admin/CustomerDetailView'
import CustomerMatchesPopup from '@/components/features/admin/CustomerMatchesPopup'
import { Customer } from '@/types/customer'

const MatchesPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [matchesCustomer, setMatchesCustomer] = useState<Customer | null>(null)

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  const handleEditCustomer = (customer: Customer) => {
    // Handle edit functionality
    console.log('Edit customer:', customer)
    // You can implement edit modal or navigate to edit page
  }

  const handleDeleteCustomer = (customerId: string) => {
    // Handle delete functionality
    console.log('Delete customer:', customerId)
    // You can implement delete confirmation and API call
  }

  const handleViewMatches = (customer: Customer) => {
    setMatchesCustomer(customer)
  }

  const handleCloseDetailView = () => {
    setSelectedCustomer(null)
  }

  const handleCloseMatchesPopup = () => {
    setMatchesCustomer(null)
  }

  const handleMessageCustomer = (customer: Customer) => {
    // Handle messaging functionality
    console.log('Message customer:', customer)
    // You can implement messaging modal or navigate to chat
  }

  const handleSendEmail = (customer: Customer) => {
    // Handle email functionality
    console.log('Send email to customer:', customer)
    // You can implement email modal or open default email client
    window.open(`mailto:${customer.email}?subject=Regarding your dating profile&body=Hello ${customer.firstName},`)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <CustomerTable
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onViewMatches={handleViewMatches}
        />
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailView
          customer={selectedCustomer}
          onClose={handleCloseDetailView}
          onEdit={handleEditCustomer}
          onMessage={handleMessageCustomer}
        />
      )}

      {/* Customer Matches Popup */}
      {matchesCustomer && (
        <CustomerMatchesPopup
          customer={matchesCustomer}
          onClose={handleCloseMatchesPopup}
          onViewCustomer={handleViewCustomer}
          onSendEmail={handleSendEmail}
        />
      )}
    </AdminLayout>
  )
}

export default MatchesPage
