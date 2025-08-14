"use client"

import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Heart,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Customer, CustomerTableData } from '@/types/customer'
import { useUsers, useApiErrorHandler } from '@/hooks'

interface CustomerTableProps {
  onViewCustomer?: (customer: Customer) => void
  onEditCustomer?: (customer: Customer) => void
  onDeleteCustomer?: (customerId: string) => void
  onViewMatches?: (customer: Customer) => void
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewMatches
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // API hooks
  const { users, loading, error, refetch } = useUsers()
  const { handleApiError } = useApiErrorHandler()

  // Transform API data to table format
  const tableData: CustomerTableData[] = useMemo(() => 
    users.map(user => ({
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      age: user.age,
      city: user.city,
      maritalStatus: user.marital_status === 'single' ? 'Single' : 
                   user.marital_status === 'divorced' ? 'Divorced' : 
                   user.marital_status === 'widowed' ? 'Widowed' : 'Other',
      statusTag: user.income === 'high' ? 'Active' : 
                user.income === 'medium' ? 'Matched' : 
                user.income === 'low' ? 'Pending' : 'Inactive',
      email: user.email,
    })), [users]
  )

  // Define columns
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
        const user = users.find(u => u.id.toString() === row.original.id)
        const customer: Customer | undefined = user ? {
          id: user.id.toString(),
          firstName: user.first_name,
          lastName: user.last_name,
          gender: user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other',
          dateOfBirth: user.date_of_birth,
          age: user.age,
          country: user.country,
          city: user.city,
          height: user.height.toString(),
          email: user.email,
          phoneNumber: user.phone_number,
          undergraduateCollege: user.undergraduate_college,
          degree: user.degree,
          income: parseInt(user.income) || 0,
          currentCompany: user.current_company,
          designation: user.designation,
          maritalStatus: user.marital_status === 'single' ? 'Single' : 
                        user.marital_status === 'divorced' ? 'Divorced' : 
                        user.marital_status === 'widowed' ? 'Widowed' : 'Single',
          languagesKnown: [],
          siblings: user.siblings,
          caste: user.caste,
          religion: user.religion,
          wantKids: user.want_kids === 'yes' ? 'Yes' : user.want_kids === 'no' ? 'No' : 'Maybe',
          openToRelocate: user.open_to_relocate === 'yes' ? 'Yes' : user.open_to_relocate === 'no' ? 'No' : 'Maybe',
          openToPets: user.open_to_pets === 'yes' ? 'Yes' : user.open_to_pets === 'no' ? 'No' : 'Maybe',
          statusTag: user.income === 'high' ? 'Active' : 
                    user.income === 'medium' ? 'Matched' : 
                    user.income === 'low' ? 'Pending' : 'Inactive',
          createdAt: user.created_at,
          profileImage: undefined
        } : undefined
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => customer && onViewCustomer?.(customer)}
              className="h-8 w-8 p-0 text-pink-600 hover:text-pink-800 hover:bg-pink-100"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => customer && onEditCustomer?.(customer)}
              className="h-8 w-8 p-0 text-pink-600 hover:text-pink-800 hover:bg-pink-100"
              title="Edit Customer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => customer && onViewMatches?.(customer)}
              className="h-8 w-8 p-0 text-rose-600 hover:text-rose-800 hover:bg-rose-100"
              title="View Matches"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteCustomer?.(row.original.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
              title="Delete Customer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ], [onViewCustomer, onEditCustomer, onDeleteCustomer, onViewMatches])

  // Filter data based on status
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return tableData
    return tableData.filter(item => item.statusTag.toLowerCase() === statusFilter.toLowerCase())
  }, [tableData, statusFilter])

  // Initialize table
  const table = useReactTable({
    data: filteredData,
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
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {loading && (
        <Card className="border-pink-200 p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-pink-600 mr-2" />
            <span className="text-pink-700">Loading customers...</span>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Content - only show when not loading */}
      {!loading && (
        <>
          {/* Header and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-pink-900">Customer Matches ({users.length})</h2>
              <p className="text-sm text-pink-600">Manage and view all customer profiles</p>
            </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-pink-200 text-pink-700 hover:bg-pink-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-200"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-pink-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-pink-200 rounded-md bg-white text-pink-700 focus:border-pink-400 focus:ring-pink-200 focus:ring-2 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="matched">Matched</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
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
      </Card>
        </>
      )}
    </div>
  )
}

export default CustomerTable
