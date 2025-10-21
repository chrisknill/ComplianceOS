'use client'

import { useState, useEffect } from 'react'

// Default prefix
const DEFAULT_PREFIX = 'MET'

// Storage key for localStorage
const PREFIX_STORAGE_KEY = 'document-prefix'

// Custom hook to manage document prefix
export function useDocumentPrefix() {
  const [prefix, setPrefix] = useState<string>(DEFAULT_PREFIX)

  // Load prefix from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPrefix = localStorage.getItem(PREFIX_STORAGE_KEY)
      if (storedPrefix) {
        setPrefix(storedPrefix)
      }
    }
  }, [])

  // Update prefix and save to localStorage
  const updatePrefix = (newPrefix: string) => {
    setPrefix(newPrefix)
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFIX_STORAGE_KEY, newPrefix)
    }
  }

  // Generate document code with prefix
  const generateDocumentCode = (type: string, number: string) => {
    return `${prefix}-${type}-${number}`
  }

  // Update existing document code with new prefix
  const updateDocumentCode = (existingCode: string, newPrefix?: string) => {
    const currentPrefix = newPrefix || prefix
    const parts = existingCode.split('-')
    if (parts.length >= 3) {
      // Keep the type and number, update the prefix
      return `${currentPrefix}-${parts.slice(1).join('-')}`
    }
    return existingCode
  }

  return {
    prefix,
    updatePrefix,
    generateDocumentCode,
    updateDocumentCode
  }
}

// Utility function to get current prefix (for server-side or non-React contexts)
export function getCurrentPrefix(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PREFIX_STORAGE_KEY) || DEFAULT_PREFIX
  }
  return DEFAULT_PREFIX
}

// Utility function to update prefix (for non-React contexts)
export function setCurrentPrefix(newPrefix: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PREFIX_STORAGE_KEY, newPrefix)
  }
}
