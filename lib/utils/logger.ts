type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
  context?: string
}

class ClientLogger {
  private logLevel: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || (this.isDevelopment ? 'debug' : 'info')
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.logLevel)
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? `[${context}]` : ''
    return `${timestamp} ${level.toUpperCase().padEnd(5)} ${contextStr} ${message}`
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    }
  }

  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    if (!this.shouldLog(level)) return

    const formattedMessage = this.formatMessage(level, message, context)
    const logEntry = this.createLogEntry(level, message, data, context)

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`%c${formattedMessage}`, 'color: #6b7280', data || '')
        }
        break
      case 'info':
        console.info(`%c${formattedMessage}`, 'color: #3b82f6', data || '')
        break
      case 'warn':
        console.warn(`%c${formattedMessage}`, 'color: #f59e0b', data || '')
        break
      case 'error':
        console.error(`%c${formattedMessage}`, 'color: #ef4444', data || '')
        if (data instanceof Error) {
          console.error('Error details:', data.stack)
        }
        break
    }

    if (this.isDevelopment && data) {
      console.log('Data:', data)
    }

    if (window && (window as any).__CORPOVIEW_LOGS__) {
      ;(window as any).__CORPOVIEW_LOGS__.push(logEntry)
      const maxLogs = 100
      if ((window as any).__CORPOVIEW_LOGS__.length > maxLogs) {
        ;(window as any).__CORPOVIEW_LOGS__.shift()
      }
    }
  }

  debug(message: string, data?: any, context?: string): void {
    this.log('debug', message, data, context)
  }

  info(message: string, data?: any, context?: string): void {
    this.log('info', message, data, context)
  }

  warn(message: string, data?: any, context?: string): void {
    this.log('warn', message, data, context)
  }

  error(message: string, error?: Error | any, context?: string): void {
    this.log('error', message, error, context)
  }

  getLogs(): LogEntry[] {
    if (typeof window !== 'undefined' && (window as any).__CORPOVIEW_LOGS__) {
      return (window as any).__CORPOVIEW_LOGS__
    }
    return []
  }

  clearLogs(): void {
    if (typeof window !== 'undefined' && (window as any).__CORPOVIEW_LOGS__) {
      ;(window as any).__CORPOVIEW_LOGS__ = []
    }
  }
}

if (typeof window !== 'undefined' && !(window as any).__CORPOVIEW_LOGS__) {
  ;(window as any).__CORPOVIEW_LOGS__ = []
}

export const logger = new ClientLogger()

