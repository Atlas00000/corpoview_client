'use client'

import { useStockQuote, useCompanyProfile } from '@/lib/hooks/useStockData'

interface StockHeaderProps {
  symbol: string
  className?: string
}

export default function StockHeader({ symbol, className = '' }: StockHeaderProps) {
  const { quote, isLoading: quoteLoading } = useStockQuote(symbol)
  const { profile, isLoading: profileLoading } = useCompanyProfile(symbol)

  if (quoteLoading || profileLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className={`text-red-600 dark:text-red-400 ${className}`}>
        Failed to load stock data
      </div>
    )
  }

  const isPositive = quote.change >= 0
  const changeColor = isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profile?.companyName || quote.symbol}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {quote.symbol} • {profile?.exchange || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ${quote.price.toFixed(2)}
          </div>
          <div className={`text-lg font-medium ${changeColor}`}>
            {isPositive ? '+' : ''}
            {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
            {quote.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${quote.open.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">High</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${quote.high.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Low</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${quote.low.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {quote.volume.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

