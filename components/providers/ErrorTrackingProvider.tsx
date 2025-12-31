'use client'

import { useEffect } from 'react'
import { initErrorTracker } from '@/lib/tracking/errorTracker'

/**
 * Provider component to initialize error tracking
 * Should be placed high in the component tree
 */
export function ErrorTrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize error tracking
    const provider = (process.env.NEXT_PUBLIC_ERROR_TRACKING_PROVIDER as 'console' | 'sentry') || 'console'
    const config = provider === 'sentry' ? {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    } : undefined

    initErrorTracker(provider, config)
  }, [])

  return <>{children}</>
}

export default ErrorTrackingProvider

