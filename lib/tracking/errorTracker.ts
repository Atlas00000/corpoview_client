/**
 * Error tracking service
 * Provides a centralized way to track and report errors
 * Supports multiple error tracking providers (Sentry, LogRocket, custom, etc.)
 */

export interface ErrorContext {
  userId?: string
  userEmail?: string
  url?: string
  userAgent?: string
  timestamp?: string
  [key: string]: any
}

export interface ErrorInfo {
  message: string
  error?: Error
  stack?: string
  context?: ErrorContext
  level?: 'error' | 'warning' | 'info'
  tags?: Record<string, string>
}

export interface ErrorTracker {
  /**
   * Capture an exception/error
   */
  captureException(error: Error, context?: ErrorContext): void

  /**
   * Capture a message
   */
  captureMessage(message: string, level?: 'error' | 'warning' | 'info', context?: ErrorContext): void

  /**
   * Set user context
   */
  setUser(userId: string, email?: string, additionalData?: Record<string, any>): void

  /**
   * Clear user context
   */
  clearUser(): void

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category?: string, level?: 'error' | 'warning' | 'info', data?: Record<string, any>): void

  /**
   * Set additional context
   */
  setContext(key: string, context: Record<string, any>): void

  /**
   * Set tags for filtering
   */
  setTag(key: string, value: string): void
}

/**
 * Console-based error tracker (development/default)
 * Logs errors to console and optionally sends to a logging endpoint
 */
class ConsoleErrorTracker implements ErrorTracker {
  private user: { id: string; email?: string; [key: string]: any } | null = null
  private context: Record<string, Record<string, any>> = {}
  private tags: Record<string, string> = {}
  private breadcrumbs: Array<{
    message: string
    category?: string
    level: string
    data?: Record<string, any>
    timestamp: string
  }> = []

  captureException(error: Error, context?: ErrorContext): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      error,
      stack: error.stack,
      context: {
        ...context,
        ...this.getGlobalContext(),
        timestamp: new Date().toISOString(),
      },
      level: 'error',
      tags: { ...this.tags },
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Captured')
      console.error('Error:', error)
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
      console.error('Context:', errorInfo.context)
      console.error('Tags:', errorInfo.tags)
      console.error('Breadcrumbs:', this.breadcrumbs)
      console.groupEnd()
    }

    // In production, send to logging endpoint
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(errorInfo).catch((err) => {
        console.error('Failed to send error to server:', err)
      })
    }

    // Keep last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift()
    }
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info', context?: ErrorContext): void {
    const errorInfo: ErrorInfo = {
      message,
      context: {
        ...context,
        ...this.getGlobalContext(),
        timestamp: new Date().toISOString(),
      },
      level,
      tags: { ...this.tags },
    }

    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.info
      logMethod(`[${level.toUpperCase()}] ${message}`, errorInfo.context)
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(errorInfo).catch((err) => {
        console.error('Failed to send error to server:', err)
      })
    }
  }

  setUser(userId: string, email?: string, additionalData?: Record<string, any>): void {
    this.user = { id: userId, email, ...additionalData }
  }

  clearUser(): void {
    this.user = null
  }

  addBreadcrumb(message: string, category?: string, level: 'error' | 'warning' | 'info' = 'info', data?: Record<string, any>): void {
    this.breadcrumbs.push({
      message,
      category,
      level,
      data,
      timestamp: new Date().toISOString(),
    })

    // Keep last 100 breadcrumbs
    if (this.breadcrumbs.length > 100) {
      this.breadcrumbs.shift()
    }
  }

  setContext(key: string, context: Record<string, any>): void {
    this.context[key] = context
  }

  setTag(key: string, value: string): void {
    this.tags[key] = value
  }

  private getGlobalContext(): ErrorContext {
    return {
      ...(this.user && {
        userId: this.user.id,
        userEmail: this.user.email,
        ...this.user,
      }),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...Object.values(this.context).reduce((acc, ctx) => ({ ...acc, ...ctx }), {}),
    }
  }

  private async sendToServer(errorInfo: ErrorInfo): Promise<void> {
    try {
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorInfo,
          breadcrumbs: this.breadcrumbs.slice(-20), // Send last 20 breadcrumbs
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to send error: ${response.statusText}`)
      }
    } catch (error) {
      // Silently fail - don't throw errors from error tracking
      console.error('Error tracking failed:', error)
    }
  }
}

/**
 * Sentry error tracker (when Sentry is configured)
 */
class SentryErrorTracker implements ErrorTracker {
  private Sentry: any

  constructor(SentryLib: any) {
    this.Sentry = SentryLib
  }

  captureException(error: Error, context?: ErrorContext): void {
    if (context) {
      this.Sentry.withScope((scope: any) => {
        if (context.userId) {
          scope.setUser({ id: context.userId, email: context.userEmail })
        }
        Object.keys(context).forEach((key) => {
          if (key !== 'userId' && key !== 'userEmail') {
            scope.setContext(key, { [key]: context[key] })
          }
        })
        this.Sentry.captureException(error)
      })
    } else {
      this.Sentry.captureException(error)
    }
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info', context?: ErrorContext): void {
    const sentryLevel = level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info'
    
    if (context) {
      this.Sentry.withScope((scope: any) => {
        if (context.userId) {
          scope.setUser({ id: context.userId, email: context.userEmail })
        }
        Object.keys(context).forEach((key) => {
          if (key !== 'userId' && key !== 'userEmail') {
            scope.setContext(key, { [key]: context[key] })
          }
        })
        scope.setLevel(sentryLevel)
        this.Sentry.captureMessage(message, sentryLevel)
      })
    } else {
      this.Sentry.captureMessage(message, sentryLevel)
    }
  }

  setUser(userId: string, email?: string, additionalData?: Record<string, any>): void {
    this.Sentry.setUser({ id: userId, email, ...additionalData })
  }

  clearUser(): void {
    this.Sentry.setUser(null)
  }

  addBreadcrumb(message: string, category?: string, level: 'error' | 'warning' | 'info' = 'info', data?: Record<string, any>): void {
    this.Sentry.addBreadcrumb({
      message,
      category: category || 'default',
      level,
      data,
      timestamp: Date.now() / 1000,
    })
  }

  setContext(key: string, context: Record<string, any>): void {
    this.Sentry.setContext(key, context)
  }

  setTag(key: string, value: string): void {
    this.Sentry.setTag(key, value)
  }
}

// Global error tracker instance
let errorTracker: ErrorTracker = new ConsoleErrorTracker()

/**
 * Initialize error tracker
 * Can be configured to use Sentry or other providers
 */
export function initErrorTracker(provider?: 'console' | 'sentry', config?: any): void {
  if (provider === 'sentry' && typeof window !== 'undefined' && config?.dsn) {
    // Only try to use Sentry if DSN is provided
    // In production, you would install @sentry/nextjs package
    // For now, we'll use console tracker as fallback
    console.warn('Sentry provider requested but @sentry/nextjs not installed. Using console tracker.')
    errorTracker = new ConsoleErrorTracker()
  } else {
    errorTracker = new ConsoleErrorTracker()
  }
}

/**
 * Get the current error tracker instance
 */
export function getErrorTracker(): ErrorTracker {
  return errorTracker
}

/**
 * Convenience functions
 */
export const errorTracking = {
  captureException: (error: Error, context?: ErrorContext) => errorTracker.captureException(error, context),
  captureMessage: (message: string, level?: 'error' | 'warning' | 'info', context?: ErrorContext) =>
    errorTracker.captureMessage(message, level, context),
  setUser: (userId: string, email?: string, additionalData?: Record<string, any>) =>
    errorTracker.setUser(userId, email, additionalData),
  clearUser: () => errorTracker.clearUser(),
  addBreadcrumb: (message: string, category?: string, level?: 'error' | 'warning' | 'info', data?: Record<string, any>) =>
    errorTracker.addBreadcrumb(message, category, level, data),
  setContext: (key: string, context: Record<string, any>) => errorTracker.setContext(key, context),
  setTag: (key: string, value: string) => errorTracker.setTag(key, value),
}

export default errorTracking

