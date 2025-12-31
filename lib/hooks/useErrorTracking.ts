'use client'

import { useCallback } from 'react'
import { errorTracking, ErrorContext } from '@/lib/tracking/errorTracker'

/**
 * React hook for error tracking
 * Provides convenient methods to track errors and events
 */
export function useErrorTracking() {
  const captureException = useCallback((error: Error, context?: ErrorContext) => {
    errorTracking.captureException(error, context)
  }, [])

  const captureMessage = useCallback((
    message: string,
    level?: 'error' | 'warning' | 'info',
    context?: ErrorContext
  ) => {
    errorTracking.captureMessage(message, level, context)
  }, [])

  const setUser = useCallback((userId: string, email?: string, additionalData?: Record<string, any>) => {
    errorTracking.setUser(userId, email, additionalData)
  }, [])

  const clearUser = useCallback(() => {
    errorTracking.clearUser()
  }, [])

  const addBreadcrumb = useCallback((
    message: string,
    category?: string,
    level?: 'error' | 'warning' | 'info',
    data?: Record<string, any>
  ) => {
    errorTracking.addBreadcrumb(message, category, level, data)
  }, [])

  const setContext = useCallback((key: string, context: Record<string, any>) => {
    errorTracking.setContext(key, context)
  }, [])

  const setTag = useCallback((key: string, value: string) => {
    errorTracking.setTag(key, value)
  }, [])

  return {
    captureException,
    captureMessage,
    setUser,
    clearUser,
    addBreadcrumb,
    setContext,
    setTag,
  }
}

export default useErrorTracking

