"use client"

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/features/admin/AdminLayout'
import CustomerTable from '@/components/features/admin/CustomerTable'
import CustomerDetailView from '@/components/features/admin/CustomerDetailView'
import CustomerMatchesPopup from '@/components/features/admin/CustomerMatchesPopup'
import { Customer } from '@/types/customer'

interface ParameterScore {
  score: number
  reason: string
  age_difference?: number
  income_ratio?: number
}

interface Match {
  id: number
  full_name: string
  age: number
  city: string
  country: string
  height: string
  degree: string
  current_company: string
  designation: string
  income: number
  religion: string
  caste: string
  languages_known: string[]
  want_kids: string
  open_to_relocate: string
  compatibility_score: number
  parameter_scores: {
    age: ParameterScore
    income: ParameterScore
    caste_religion: ParameterScore
    location_relocate: ParameterScore
    want_kids: ParameterScore
    education: ParameterScore
    company_designation: ParameterScore
    marital_status: ParameterScore
    siblings: ParameterScore
    languages: ParameterScore
    height: ParameterScore
    open_to_pets: ParameterScore
  }
  match_insights: string[]
  potential_concerns: string[]
}

interface MatchesResponse {
  status: string
  user_id: number
  user_name: string
  user_gender: string
  total_matches_found: number
  algorithm_version: string
  matches: Match[]
}

const MatchesPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [matchesCustomer, setMatchesCustomer] = useState<Customer | null>(null)
  const [matchesData, setMatchesData] = useState<MatchesResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async (userId: number) => {
    setLoading(true)
    setError(null)

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTU0NTQzNTR9.LtJGeRHJlrD0-f98tb8EPk_CqWPlGubRSlu5pgC2Hvg"
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`http://localhost:8000/api/v1/matches/?id=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: MatchesResponse = await response.json()
      console.log(result)
      setMatchesData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    console.log(customer)
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

  const handleViewMatches = async (customer: Customer) => {
    setMatchesCustomer(customer)
    // Fetch matches for this customer
    if (customer.id) {
      await fetchMatches(parseInt(customer.id))
    }
  }

  const handleCloseDetailView = () => {
    setSelectedCustomer(null)
  }

  const handleCloseMatchesPopup = () => {
    setMatchesCustomer(null)
    setMatchesData(null)
    setError(null)
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