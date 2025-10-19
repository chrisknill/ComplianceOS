'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Bell, Search, LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Global search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to a global search results page
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      // Escape to clear search
      if (e.key === 'Escape' && isSearchFocused) {
        clearSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchFocused])

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, risks, training... (Ctrl+K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-10 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-slate-600 focus:border-transparent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-slate-300" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">{session?.user?.role || 'USER'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: '/signin' })}
            title="Sign out"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

