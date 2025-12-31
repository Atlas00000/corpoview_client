'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { errorTracking } from '@/lib/tracking/errorTracker'
import { Card, Button } from '@/components/ui'
import { IconAlertCircle, IconHome, IconRefresh } from '@/components/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component that catches React component errors
 * and reports them to the error tracking service
 */
export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Track error
    errorTracking.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Store error info
    this.setState({
      error,
      errorInfo,
    })
  }

  componentDidUpdate(prevProps: Props): void {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error boundary if resetKeys have changed
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }

    // Reset on any prop change if enabled
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary()
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    }, 100)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} onReset={this.resetErrorBoundary} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null
  onReset: () => void
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  const handleReload = (): void => {
    window.location.reload()
  }

  const handleGoHome = (): void => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card variant="elevated" className="max-w-2xl w-full p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <IconAlertCircle className="w-8 h-8 text-danger-600 dark:text-danger-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Something went wrong
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
          </p>

          {error && process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Error Details (Development Only):
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-mono break-all">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs text-slate-600 dark:text-slate-400 overflow-auto max-h-64">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onReset}
              className="flex items-center justify-center gap-2"
            >
              <IconRefresh className="w-5 h-5" />
              Try Again
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2"
            >
              <IconHome className="w-5 h-5" />
              Go Home
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleReload}
            >
              Reload Page
            </Button>
          </div>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
            If this problem persists, please contact support.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ErrorBoundary

