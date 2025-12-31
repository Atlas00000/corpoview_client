'use client'

import { memo, useMemo } from 'react'
import { useStockQuote, useStockDaily } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IconTrendingUp, IconTrendingDown } from '@/components/icons'

export interface EnhancedStockCardProps {
  symbol: string
  name?: string
  index: number
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

function generateSparkline(prices: number[]): { path: string; viewBox: string } | null {
  if (!prices || prices.length < 2) return null
  
  const max = Math.max(...prices)
  const min = Math.min(...prices)
  const range = max - min || 1
  
  const normalized = prices.map((p) => (p - min) / range)
  const width = 60
  const height = 24
  const padding = 2
  const stepX = width / (normalized.length - 1 || 1)
  
  const pathData = normalized
    .map((y, i) => {
      const x = i * stepX
      const normalizedY = height - padding - (y * (height - padding * 2))
      return i === 0 ? `M ${x} ${normalizedY}` : `L ${x} ${normalizedY}`
    })
    .join(' ')
  
  return {
    path: pathData,
    viewBox: `0 0 ${width} ${height}`,
  }
}

function EnhancedStockCard({ symbol, name, index }: EnhancedStockCardProps) {
  const { quote, isLoading: quoteLoading } = useStockQuote(symbol)
  const { data: dailyData, isLoading: dailyLoading } = useStockDaily(symbol, 'compact')

  const isLoading = quoteLoading || dailyLoading

  // Memoize computed values
  const isPositive = useMemo(() => quote?.changePercent >= 0 ?? false, [quote?.changePercent])
  const changeColor = useMemo(
    () => isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400',
    [isPositive]
  )
  const gradientFrom = useMemo(
    () => isPositive
      ? 'from-success-50 via-emerald-50 to-success-100 dark:from-success-500/20 dark:via-emerald-500/20 dark:to-success-600/20'
      : 'from-danger-50 via-rose-50 to-danger-100 dark:from-danger-500/20 dark:via-rose-500/20 dark:to-danger-600/20',
    [isPositive]
  )

  // Memoize sparkline data and generation
  const sparklineData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return []
    return dailyData.slice(-20).map((d) => d.close)
  }, [dailyData])

  const sparkline = useMemo(() => generateSparkline(sparklineData), [sparklineData])

  // Memoize formatted price
  const formattedPrice = useMemo(() => {
    if (!quote) return ''
    return formatPrice(quote.price)
  }, [quote?.price])

  // Memoize formatted change
  const formattedChange = useMemo(() => {
    if (!quote) return ''
    return formatPrice(Math.abs(quote.change))
  }, [quote?.change])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
        className="relative h-32 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 animate-pulse"
      />
    )
  }

  if (!quote) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group"
    >
      <Link
        href={`/stocks/${symbol}`}
        className="block relative h-32 rounded-3xl bg-gradient-to-br ${gradientFrom} p-5 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">
                  {symbol}
                </h3>
                {isPositive ? (
                  <IconTrendingUp className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
                ) : (
                  <IconTrendingDown className="w-4 h-4 text-danger-600 dark:text-danger-400 flex-shrink-0" />
                )}
              </div>
              {name && (
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {name}
                </p>
              )}
            </div>
            <div className={`text-right ml-2 ${changeColor}`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="text-sm font-bold"
              >
                {isPositive ? '+' : ''}
                {quote.changePercent.toFixed(2)}%
              </motion.div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.15 }}
                className="text-2xl font-bold text-slate-900 dark:text-white"
              >
                {formattedPrice}
              </motion.div>
              <div className={`text-xs font-semibold mt-0.5 ${changeColor}`}>
                {isPositive ? '+' : ''}
                {formattedChange}
              </div>
            </div>

            {sparkline && (
              <div className="flex items-center justify-end mb-1">
                <svg
                  width="60"
                  height="24"
                  viewBox={sparkline.viewBox}
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id={`gradient-${symbol}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#10b981' : '#ef4444'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#10b981' : '#ef4444'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={`${sparkline.path} L 60 24 L 0 24 Z`}
                    fill={`url(#gradient-${symbol})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.4, duration: 0.5 }}
                  />
                  <motion.path
                    d={sparkline.path}
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/10 group-hover:to-secondary-500/10 rounded-3xl transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />

        <motion.div
          className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/20 dark:group-hover:bg-white/5 transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </Link>
    </motion.div>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(EnhancedStockCard, (prevProps, nextProps) => {
  // Only re-render if symbol or name changes
  return prevProps.symbol === nextProps.symbol && prevProps.name === nextProps.name && prevProps.index === nextProps.index
})

