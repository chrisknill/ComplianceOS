// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
          <Link href="/dashboard" className="hover:text-slate-900">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4" />
              {item.href ? (
                <Link href={item.href} className="hover:text-slate-900">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}
      
      {/* Title and Subtitle */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="text-slate-600 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
