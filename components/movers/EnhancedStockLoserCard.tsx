'use client'

import { useStockQuote, useStockDaily } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IconTrendingDown } from '@/components/icons'

export interface EnhancedStockLoserCardProps {
  symbol: string
  name?: string
  rank: number
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

export default function EnhancedStockLoserCard({
  symbol,
  name,
  rank,
  index,
}: EnhancedStockLoserCardProps) {
  const { quote, isLoading: quoteLoading } = useStockQuote(symbol)
  const { data: dailyData, isLoading: dailyLoading } = useStockDaily(symbol, 'compact')

  const isLoading = quoteLoading || dailyLoading

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
        className="relative h-40 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 animate-pulse"
      />
    )
  }

  if (!quote || quote.changePercent >= 0) return null

  const isPositive = false
  const changeColor = 'text-danger-600 dark:text-danger-400'
  const gradientFrom = 'from-danger-50 via-rose-50 to-danger-100 dark:from-danger-500/20 dark:via-rose-500/20 dark:to-danger-600/20'
  
  const sparklineData = dailyData && dailyData.length > 0
    ? dailyData.slice(-20).map((d) => d.close)
    : []

  const sparkline = generateSparkline(sparklineData)

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
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group"
    >
      <Link
        href={`/stocks/${symbol}`}
        className="block relative h-40 rounded-3xl bg-gradient-to-br ${gradientFrom} p-5 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-danger-500 to-rose-600 flex items-center justify-center shadow-lg shadow-danger-500/30">
                  <span className="text-sm font-bold text-white">{rank}</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-danger-500/50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                  {symbol}
                </h3>
                {name && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {name}
                  </p>
                )}
              </div>
              <IconTrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0" />
            </div>
            <div className={`text-right ml-2 ${changeColor}`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-lg font-bold"
              >
                {quote.changePercent.toFixed(2)}%
              </motion.div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.15 }}
                className="text-2xl font-bold text-slate-900 dark:text-white"
              >
                {formatPrice(quote.price)}
              </motion.div>
              <div className={`text-xs font-semibold mt-0.5 ${changeColor}`}>
                {formatPrice(Math.abs(quote.change))}
              </div>
            </div>

            {sparkline && (
              <div className="flex items-center justify-end mb-1 ml-2">
                <svg
                  width="60"
                  height="24"
                  viewBox={sparkline.viewBox}
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id={`loser-gradient-${symbol}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ef4444"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="#ef4444"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={`${sparkline.path} L 60 24 L 0 24 Z`}
                    fill={`url(#loser-gradient-${symbol})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                  />
                  <motion.path
                    d={sparkline.path}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20 dark:border-white/10">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Volume</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {(quote.volume / 1e6).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Range</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {formatPrice(quote.low)} - {formatPrice(quote.high)}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-danger-500/0 to-rose-500/0 group-hover:from-danger-500/10 group-hover:to-rose-500/10 rounded-3xl transition-all duration-300"
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

