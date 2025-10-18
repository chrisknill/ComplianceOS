import { useState, useEffect, useCallback, useMemo } from 'react'
import { ContractReview, ContractReviewFilters, ContractReviewSort, ContractReviewStats } from '@/types/contract-review'
import { toast } from 'sonner'

interface UseContractReviewsReturn {
  contracts: ContractReview[]
  loading: boolean
  error: string | null
  stats: ContractReviewStats
  sortedContracts: ContractReview[]
  fetchContracts: () => Promise<void>
  createContract: (data: Partial<ContractReview>) => Promise<boolean>
  updateContract: (id: string, data: Partial<ContractReview>) => Promise<boolean>
  deleteContract: (id: string) => Promise<boolean>
  refreshContracts: () => Promise<void>
}

export function useContractReviews(
  filters: ContractReviewFilters,
  sort: ContractReviewSort
): UseContractReviewsReturn {
  const [contracts, setContracts] = useState<ContractReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.contractType && filters.contractType !== 'ALL') params.append('contractType', filters.contractType)
      if (filters.status && filters.status !== 'ALL') params.append('status', filters.status)
      if (filters.priority && filters.priority !== 'ALL') params.append('priority', filters.priority)
      if (filters.riskLevel && filters.riskLevel !== 'ALL') params.append('riskLevel', filters.riskLevel)
      
      const response = await fetch(`/api/contract-review?${params.toString()}`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setContracts(Array.isArray(data) ? data : [])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch contracts' }))
        setError(errorData.error || 'Failed to fetch contracts')
        setContracts([])
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setError('An unexpected error occurred')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createContract = useCallback(async (data: Partial<ContractReview>): Promise<boolean> => {
    try {
      const response = await fetch('/api/contract-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Contract created successfully')
        await fetchContracts()
        return true
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create contract' }))
        toast.error(errorData.error || 'Failed to create contract')
        return false
      }
    } catch (error) {
      console.error('Error creating contract:', error)
      toast.error('An unexpected error occurred')
      return false
    }
  }, [fetchContracts])

  const updateContract = useCallback(async (id: string, data: Partial<ContractReview>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/contract-review/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Contract updated successfully')
        await fetchContracts()
        return true
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update contract' }))
        toast.error(errorData.error || 'Failed to update contract')
        return false
      }
    } catch (error) {
      console.error('Error updating contract:', error)
      toast.error('An unexpected error occurred')
      return false
    }
  }, [fetchContracts])

  const deleteContract = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/contract-review/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Contract deleted successfully')
        await fetchContracts()
        return true
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete contract' }))
        toast.error(errorData.error || 'Failed to delete contract')
        return false
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
      toast.error('An unexpected error occurred')
      return false
    }
  }, [fetchContracts])

  const refreshContracts = useCallback(async () => {
    await fetchContracts()
  }, [fetchContracts])

  // Calculate statistics
  const stats = useMemo((): ContractReviewStats => {
    const contractsArray = Array.isArray(contracts) ? contracts : []
    return {
      totalContracts: contractsArray.length,
      draftCount: contractsArray.filter(c => c.status === 'DRAFT').length,
      underReviewCount: contractsArray.filter(c => c.status === 'UNDER_REVIEW').length,
      approvedCount: contractsArray.filter(c => c.status === 'APPROVED').length,
      expiredCount: contractsArray.filter(c => c.status === 'EXPIRED').length,
      highPriorityCount: contractsArray.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length,
      highRiskCount: contractsArray.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length,
      totalValue: contractsArray.reduce((sum, c) => sum + (c.value || 0), 0),
    }
  }, [contracts])

  // Sort contracts
  const sortedContracts = useMemo(() => {
    const contractsArray = Array.isArray(contracts) ? contracts : []
    return [...contractsArray].sort((a, b) => {
      const aValue = a[sort.field as keyof ContractReview]
      const bValue = b[sort.field as keyof ContractReview]
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [contracts, sort])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return {
    contracts,
    loading,
    error,
    stats,
    sortedContracts,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    refreshContracts,
  }
}
