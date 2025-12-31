'use client'

import { useStockQuote, useCompanyProfile, useCompanyOverview } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { TrendIndicator } from '@/components/data'

export interface StockDetailHeaderProps {
  symbol: string
}

function formatLargeNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'N/A'
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString()}`
}

export default function StockDetailHeader({ symbol }: StockDetailHeaderProps) {
  const { quote, isLoading: quoteLoading } = useStockQuote(symbol)
  const { profile, isLoading: profileLoading } = useCompanyProfile(symbol)
  const { overview, isLoading: overviewLoading } = useCompanyOverview(symbol)

  if (quoteLoading || profileLoading || overviewLoading) {
    return (
      <SlideUp>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton width={200} height={40} className="rounded-lg" />
            <Skeleton width={150} height={40} className="rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={100} className="rounded-xl" />
            ))}
          </div>
        </div>
      </SlideUp>
    )
  }

  if (!quote) return null

  const isPositive = quote.changePercent >= 0
  const changeColor = isPositive
    ? 'text-success-600 dark:text-success-500'
    : 'text-danger-600 dark:text-danger-500'

  const metrics = [
    {
      label: 'Open',
      value: `$${quote.open.toFixed(2)}`,
    },
    {
      label: 'High',
      value: `$${quote.high.toFixed(2)}`,
    },
    {
      label: 'Low',
      value: `$${quote.low.toFixed(2)}`,
    },
    {
      label: 'Volume',
      value: `${(quote.volume / 1e6).toFixed(2)}M`,
    },
  ]

  if (overview) {
    if (overview.MarketCapitalization) {
      metrics.push({
        label: 'Market Cap',
        value: formatLargeNumber(overview.MarketCapitalization),
      })
    }
    if (overview.PERatio) {
      metrics.push({
        label: 'P/E Ratio',
        value: overview.PERatio.toString(),
      })
    }
    if (overview.DividendYield) {
      metrics.push({
        label: 'Dividend Yield',
        value: `${parseFloat(overview.DividendYield).toFixed(2)}%`,
      })
    }
  }

  return (
    <SlideUp>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2"
            >
              {profile?.companyName || quote.symbol}
            </motion.h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                {quote.symbol}
              </p>
              {profile?.exchange && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {profile.exchange}
                  </p>
                </>
              )}
              {overview?.Sector && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <p className="text-lg text-slate-600 dark:text-slate-400">{overview.Sector}</p>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2"
            >
              ${quote.price.toFixed(2)}
            </motion.div>
            <div className="flex items-center justify-end gap-2">
              <TrendIndicator
                value={quote.changePercent}
                isPositive={isPositive}
                size="lg"
              />
            </div>
            <p className={`text-lg font-semibold mt-1 ${changeColor}`}>
              {isPositive ? '+' : ''}
              ${quote.change.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {metric.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideUp>
  )
}

