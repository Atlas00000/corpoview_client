'use client'

import { useState, useMemo, lazy, Suspense } from 'react'
import { useCryptoHistory, useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { IconTrendingUp, IconTrendingDown, IconChartLine } from '@/components/icons'
import { SlideUp, Skeleton } from '@/components/effects'

// Lazy load heavy chart component
const LineChart = lazy(() => import('@/components/charts/d3/LineChart'))

export type TimeRange = '7d' | '30d' | '90d' | '1y'

export interface EnhancedCryptoPriceHistoryCardProps {
  cryptoId: string
  symbol: string
  name?: string
  defaultRange?: TimeRange
  index: number
}

function getDaysFromRange(range: TimeRange): number {
  switch (range) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '1y':
      return 365
    default:
      return 30
  }
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price)
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function EnhancedCryptoPriceHistoryCard({
  cryptoId,
  symbol,
  name,
  defaultRange = '30d',
  index,
}: EnhancedCryptoPriceHistoryCardProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange)
  const days = getDaysFromRange(range)
  
  const { history, isLoading: historyLoading } = useCryptoHistory(cryptoId, 'usd', days)
  const { markets, isLoading: marketsLoading } = useCryptoMarkets('usd', [cryptoId], 1)

  const isLoading = historyLoading || marketsLoading
  const crypto = markets && markets.length > 0 ? markets[0] : null

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return []
    return history.map((point) => ({
      date: point.date,
      value: point.price,
    }))
  }, [history])

  const priceStats = useMemo(() => {
    if (!history || history.length === 0) return null
    
    const prices = history.map((h) => h.price)
    const current = prices[prices.length - 1]
    const previous = prices[0]
    const high = Math.max(...prices)
    const low = Math.min(...prices)
    const change = current - previous
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0
    
    return {
      current,
      previous,
      high,
      low,
      change,
      changePercent,
    }
  }, [history])

  const isPositive = priceStats ? priceStats.changePercent >= 0 : true
  const gradientFrom = isPositive
    ? 'from-success-50 via-emerald-50 to-success-100 dark:from-success-500/20 dark:via-emerald-500/20 dark:to-success-600/20'
    : 'from-danger-50 via-rose-50 to-danger-100 dark:from-danger-500/20 dark:via-rose-500/20 dark:to-danger-600/20'

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
        className="relative h-[500px] rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 animate-pulse"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ scale: 1.01 }}
      className="relative group"
    >
      <Link
        href={`/crypto/${cryptoId}`}
        className="block relative rounded-3xl bg-gradient-to-br ${gradientFrom} p-6 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {crypto?.image && (
                <Image
                  src={crypto.image}
                  alt={name || symbol}
                  width={48}
                  height={48}
                  className="rounded-full flex-shrink-0 shadow-lg"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {symbol.toUpperCase()}
                  </h3>
                  <IconChartLine className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                {name && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {name}
                  </p>
                )}
                {crypto?.marketCapRank && (
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    Rank #{crypto.marketCapRank}
                  </div>
                )}
              </div>
            </div>
            {priceStats && (
              <div className={`text-right ml-4 ${isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center gap-2"
                >
                  {isPositive ? (
                    <IconTrendingUp className="w-5 h-5" />
                  ) : (
                    <IconTrendingDown className="w-5 h-5" />
                  )}
                  <div>
                    <div className="text-lg font-bold">
                      {isPositive ? '+' : ''}
                      {priceStats.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-xs font-semibold">
                      {isPositive ? '+' : ''}
                      {formatPrice(Math.abs(priceStats.change))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {priceStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Price</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatPrice(priceStats.current)}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Period High</p>
                <p className="text-lg font-bold text-success-600 dark:text-success-400">
                  {formatPrice(priceStats.high)}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Period Low</p>
                <p className="text-lg font-bold text-danger-600 dark:text-danger-400">
                  {formatPrice(priceStats.low)}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Range</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatPrice(priceStats.high - priceStats.low)}
                </p>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setRange(r)
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    range === r
                      ? 'bg-white/80 dark:bg-white/20 text-slate-900 dark:text-white shadow-lg'
                      : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {crypto && (
              <div className="text-right">
                <p className="text-xs text-slate-600 dark:text-slate-400">Market Cap</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatLargeNumber(crypto.marketCap)}
                </p>
              </div>
            )}
          </div>

          <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 overflow-hidden">
            {chartData.length > 0 ? (
              <Suspense
                fallback={
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton height={300} className="rounded-xl" />
                  </div>
                }
              >
                <LineChart
                  data={chartData}
                  height={300}
                  enableZoom={true}
                  enableTooltip={true}
                  enableBrush={true}
                  color={isPositive ? '#10b981' : '#ef4444'}
                  className="w-full"
                />
              </Suspense>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">No chart data available</p>
              </div>
            )}
          </div>
        </div>

        {isPositive ? (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-success-500/0 to-emerald-500/0 group-hover:from-success-500/10 group-hover:to-emerald-500/10 rounded-3xl transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-danger-500/0 to-rose-500/0 group-hover:from-danger-500/10 group-hover:to-rose-500/10 rounded-3xl transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        )}

        <motion.div
          className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/20 dark:group-hover:bg-white/5 transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </Link>
    </motion.div>
  )
}

