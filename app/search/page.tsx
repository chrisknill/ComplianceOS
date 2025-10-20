'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, FileText, Shield, Globe, Target, Users, Building2, 
  AlertCircle, CheckCircle, Clock, ArrowRight
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  type: 'document' | 'policy' | 'risk' | 'training' | 'employee' | 'context' | 'party' | 'scope'
  description: string
  url: string
  category: string
  lastModified: Date
  relevance: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    setHasSearched(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock search results - in a real app, this would call an API
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Quality Policy',
        type: 'policy',
        description: 'Our commitment to quality excellence and customer satisfaction',
        url: '/governance/policies',
        category: 'QMS',
        lastModified: new Date('2025-01-10'),
        relevance: 95
      },
      {
        id: '2',
        title: 'Environmental Management System',
        type: 'scope',
        description: 'Environmental aspects of all operations and facilities',
        url: '/governance/scope',
        category: 'EMS',
        lastModified: new Date('2025-01-05'),
        relevance: 90
      },
      {
        id: '3',
        title: 'Customer Satisfaction Survey',
        type: 'document',
        description: 'Annual customer satisfaction survey results and analysis',
        url: '/customer-satisfaction',
        category: 'QMS',
        lastModified: new Date('2025-01-15'),
        relevance: 85
      },
      {
        id: '4',
        title: 'Health & Safety Risk Assessment',
        type: 'risk',
        description: 'Workplace safety risk identification and mitigation strategies',
        url: '/risk',
        category: 'OHS',
        lastModified: new Date('2025-01-08'),
        relevance: 80
      },
      {
        id: '5',
        title: 'Employee Training Records',
        type: 'training',
        description: 'Training completion records and competency assessments',
        url: '/training',
        category: 'Integrated',
        lastModified: new Date('2025-01-12'),
        relevance: 75
      },
      {
        id: '6',
        title: 'Organisational Context Analysis',
        type: 'context',
        description: 'Internal and external factors affecting the organisation',
        url: '/governance/context',
        category: 'Governance',
        lastModified: new Date('2025-01-10'),
        relevance: 70
      },
      {
        id: '7',
        title: 'Supplier Management Policy',
        type: 'policy',
        description: 'Supplier selection, evaluation and management procedures',
        url: '/governance/policies',
        category: 'QMS',
        lastModified: new Date('2024-12-01'),
        relevance: 65
      },
      {
        id: '8',
        title: 'Interested Parties Register',
        type: 'party',
        description: 'Stakeholder requirements and expectations management',
        url: '/governance/interested-parties',
        category: 'Governance',
        lastModified: new Date('2025-01-08'),
        relevance: 60
      }
    ]

    // Filter results based on search query
    const filteredResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort by relevance
    filteredResults.sort((a, b) => b.relevance - a.relevance)
    
    setResults(filteredResults)
    setLoading(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5 text-blue-600" />
      case 'policy': return <Shield className="h-5 w-5 text-green-600" />
      case 'risk': return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'training': return <Users className="h-5 w-5 text-purple-600" />
      case 'employee': return <Building2 className="h-5 w-5 text-orange-600" />
      case 'context': return <Target className="h-5 w-5 text-indigo-600" />
      case 'party': return <Users className="h-5 w-5 text-cyan-600" />
      case 'scope': return <Globe className="h-5 w-5 text-emerald-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'policy': return 'bg-green-100 text-green-800 border-green-200'
      case 'risk': return 'bg-red-100 text-red-800 border-red-200'
      case 'training': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'employee': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'context': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'party': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'scope': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return 'text-green-600'
    if (relevance >= 70) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Search Results</h1>
            <p className="text-slate-600 mt-1">
              {query ? `Results for "${query}"` : 'Enter a search term to find content'}
            </p>
          </div>
        </div>

        {/* Search Stats */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Search Query</p>
                  <p className="text-lg font-semibold text-slate-900">&quot;{query}&quot;</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">Results Found</p>
                <p className="text-2xl font-bold text-slate-900">{results.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !loading && results.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-600">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Search Results</h2>
            <div className="grid grid-cols-1 gap-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          {getTypeIcon(result.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{result.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                              {result.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {result.category}
                            </Badge>
                            <span className={`text-xs font-medium ${getRelevanceColor(result.relevance)}`}>
                              {result.relevance}% match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">
                          {formatDate(result.lastModified)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-3">{result.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Path: {result.url}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-500">Modified {formatDate(result.lastModified)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        {hasSearched && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Search Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-1">Try these search terms:</p>
                <ul className="space-y-1">
                  <li>• Policy names (e.g., &quot;Quality Policy&quot;)</li>
                  <li>• Document types (e.g., &quot;risk assessment&quot;)</li>
                  <li>• Categories (e.g., &quot;QMS&quot;, &quot;EMS&quot;, &quot;OHS&quot;)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Keyboard shortcuts:</p>
                <ul className="space-y-1">
                  <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Ctrl+K</kbd> Focus search</li>
                  <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> Search</li>
                  <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Esc</kbd> Clear search</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}
