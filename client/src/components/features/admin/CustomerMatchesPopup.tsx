"use client"

import React, { useState, useMemo, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Eye,
  Mail,
  Heart,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Customer, CustomerTableData } from '@/types/customer'
import { useMatches, useApiErrorHandler } from '@/hooks'

interface CustomerMatchesPopupProps {
  customer: Customer
  onClose: () => void
  onViewCustomer: (customer: Customer) => void
  onSendEmail: (customer: Customer) => void
}


const CustomerMatchesPopup: React.FC<CustomerMatchesPopupProps> = ({
  customer,
  onClose,
  onViewCustomer,
  onSendEmail
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  
  // API hooks
  const { matches, loading, error, fetchMatches } = useMatches()
  const { handleApiError } = useApiErrorHandler()

  // Fetch matches when component mounts
  useEffect(() => {
    fetchMatches({ id: parseInt(customer.id) })
  }, [customer.id, fetchMatches])

  // Transform API match data to table format
  const tableData: CustomerTableData[] = useMemo(() => 
    matches.map(match => ({
      id: match.id.toString(),
      name: `${match.first_name} ${match.last_name}`,
      age: match.age,
      city: match.city,
      maritalStatus: match.marital_status === 'single' ? 'Single' : 
                   match.marital_status === 'divorced' ? 'Divorced' : 
                   match.marital_status === 'widowed' ? 'Widowed' : 'Single',
      statusTag: match.match_score >= 8 ? 'Active' : 
                match.match_score >= 6 ? 'Matched' : 
                match.match_score >= 4 ? 'Pending' : 'Inactive',
      email: match.email,
    })), [matches]
  )

  // Define columns for matches table
  const columns = useMemo<ColumnDef<CustomerTableData, any>[]>(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3 text-pink-900 hover:text-pink-700"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-pink-900">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'age',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3 text-pink-900 hover:text-pink-700"
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-pink-700">{row.getValue('age')}</div>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => (
        <div className="text-pink-700">{row.getValue('city')}</div>
      ),
    },
    {
      accessorKey: 'maritalStatus',
      header: 'Marital Status',
      cell: ({ row }) => (
        <div className="text-pink-700">{row.getValue('maritalStatus')}</div>
      ),
    },
    {
      accessorKey: 'statusTag',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('statusTag') as string
        return (
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            status === 'Active' && "bg-green-100 text-green-800",
            status === 'Matched' && "bg-blue-100 text-blue-800",
            status === 'Pending' && "bg-yellow-100 text-yellow-800",
            status === 'Inactive' && "bg-gray-100 text-gray-800"
          )}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-pink-700 max-w-[200px] truncate">{row.getValue('email')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const match = matches.find(c => c.id.toString() === row.original.id)
        const matchCustomer: Customer | undefined = match ? {
          id: match.id.toString(),
          firstName: match.first_name,
          lastName: match.last_name,
          gender: match.gender === 'male' ? 'Male' : match.gender === 'female' ? 'Female' : 'Other',
          dateOfBirth: '', // Not available in match data
          age: match.age,
          country: match.country,
          city: match.city,
          height: match.height.toString(),
          email: match.email,
          phoneNumber: match.phone_number,
          undergraduateCollege: match.undergraduate_college,
          degree: match.degree,
          income: 0, // Not available in match data
          currentCompany: match.current_company,
          designation: match.designation,
          maritalStatus: match.marital_status === 'single' ? 'Single' : 
                        match.marital_status === 'divorced' ? 'Divorced' : 
                        match.marital_status === 'widowed' ? 'Widowed' : 'Single',
          languagesKnown: [],
          siblings: 0, // Not available in match data
          caste: '',
          religion: '',
          wantKids: 'Maybe',
          openToRelocate: 'Maybe',
          openToPets: 'Maybe',
          statusTag: match.match_score >= 8 ? 'Active' : 
                    match.match_score >= 6 ? 'Matched' : 
                    match.match_score >= 4 ? 'Pending' : 'Inactive',
          createdAt: '',
          profileImage: undefined
        } : undefined
        
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => matchCustomer && onViewCustomer(matchCustomer)}
              className="h-8 w-8 p-0 text-pink-600 hover:text-pink-800 hover:bg-pink-100"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => matchCustomer && onSendEmail(matchCustomer)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              title="Send Email"
            >
              <Mail className="h-4 w-4" />
            </Button>
            <div className="text-xs text-gray-500 ml-2">
              Score: {match?.match_score}/10
            </div>
          </div>
        )
      },
    },
  ], [matches, onViewCustomer, onSendEmail])

  // Initialize table
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-pink-900">
                Matches for {customer.firstName} {customer.lastName}
              </h2>
              <p className="text-sm text-pink-600">
                {loading ? 'Loading matches...' : `${matches.length} potential matches found`}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-pink-600 mr-2" />
              <span className="text-pink-700">Loading matches...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchMatches({ id: parseInt(customer.id) })}
                  className="border-red-200 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Content - only show when not loading and no error */}
          {!loading && !error && (
            <>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                  <Input
                    placeholder="Search matches..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                  />
                </div>
              </div>

          {/* Table */}
          <Card className="border-pink-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-pink-200 bg-pink-50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-sm font-medium text-pink-900"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-pink-100 hover:bg-pink-25 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-pink-200 bg-pink-25">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-pink-700">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} entries
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-pink-700 px-2">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {matches.length === 0 && !loading && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-pink-300 mx-auto mb-3" />
              <p className="text-pink-600">No matches found for this customer yet.</p>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerMatchesPopup
