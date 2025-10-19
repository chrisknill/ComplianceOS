// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export default function UsersPage() {
  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Users' }
  ]

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastLogin', label: 'Last Login', sortable: true }
  ]

  const data = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2025-01-18'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2025-01-17'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      role: 'Worker',
      status: 'Inactive',
      lastLogin: '2025-01-10'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        subtitle="Manage system users and their access rights"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search users..."
            onAdd={() => console.log('Add new user')}
            onEdit={(id) => console.log('Edit user', id)}
            onDelete={(id) => console.log('Delete user', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="System Administrator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
