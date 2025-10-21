'use client'

import { SessionProvider } from 'next-auth/react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-6 py-6 max-w-full">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}

