'use client'

import { useCompanyOverview, useFinancialStatements } from '@/lib/hooks/useStockData'

interface CompanyInfoProps {
  symbol: string
  className?: string
}

export default function CompanyInfo({ symbol, className = '' }: CompanyInfoProps) {
  const { overview, isLoading: overviewLoading } = useCompanyOverview(symbol)
  const { financials, isLoading: financialsLoading } = useFinancialStatements(symbol, 1)

  if (overviewLoading || financialsLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className={`text-red-600 dark:text-red-400 ${className}`}>
        Failed to load company information
      </div>
    )
  }

  const formatMarketCap = (value: string) => {
    const num = parseFloat(value)
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const latestIncome = financials?.incomeStatement?.[0]

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Company Overview
        </h2>

        {overview.Description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {overview.Description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Company Details
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">Sector</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{overview.Sector || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">Industry</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{overview.Industry || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">Market Cap</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {overview.MarketCapitalization
                    ? formatMarketCap(overview.MarketCapitalization)
                    : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">P/E Ratio</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {overview.PERatio || 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Financial Metrics
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">EPS</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{overview.EPS || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">Dividend Yield</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {overview.DividendYield ? `${overview.DividendYield}%` : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-500">Payout Ratio</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {overview.PayoutRatio ? `${overview.PayoutRatio}%` : 'N/A'}
                </dd>
              </div>
              {latestIncome && (
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-500">Revenue (Latest)</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    ${latestIncome.revenue ? latestIncome.revenue.toLocaleString() : 'N/A'}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

