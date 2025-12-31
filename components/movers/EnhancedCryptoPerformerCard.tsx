'use client'

import { CryptoMarketData, useCryptoHistory } from '@/lib/hooks/useCryptoData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { IconTrendingUp, IconTrendingDown } from '@/components/icons'

export interface EnhancedCryptoPerformerCardProps {
  crypto: CryptoMarketData
  rank: number
  index: number
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

export default function EnhancedCryptoPerformerCard({
  crypto,
  rank,
  index,
}: EnhancedCryptoPerformerCardProps) {
  const { history, isLoading: historyLoading } = useCryptoHistory(crypto.id, 'usd', 7)

  const isPositive = crypto.priceChangePercentage24h >= 0
  const changeColor = isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
  const gradientFrom = isPositive
    ? 'from-success-50 via-emerald-50 to-success-100 dark:from-success-500/20 dark:via-emerald-500/20 dark:to-success-600/20'
    : 'from-danger-50 via-rose-50 to-danger-100 dark:from-danger-500/20 dark:via-rose-500/20 dark:to-danger-600/20'
  
  const sparklineData = history && history.length > 0
    ? history.map((h) => h.price)
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
        href={`/crypto/${crypto.id}`}
        className="block relative h-40 rounded-3xl bg-gradient-to-br ${gradientFrom} p-5 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${isPositive ? 'from-success-500 to-emerald-600' : 'from-danger-500 to-rose-600'} flex items-center justify-center shadow-lg ${isPositive ? 'shadow-success-500/30' : 'shadow-danger-500/30'}`}>
                  <span className="text-sm font-bold text-white">{rank}</span>
                </div>
                {isPositive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-success-500/50"
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
                )}
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {crypto.image && (
                  <Image
                    src={crypto.image}
                    alt={crypto.name}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                    {crypto.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase truncate">
                    {crypto.symbol}
                  </p>
                </div>
              </div>
              {isPositive ? (
                <IconTrendingUp className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
              ) : (
                <IconTrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0" />
              )}
            </div>
            <div className={`text-right ml-2 ${changeColor}`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-lg font-bold"
              >
                {isPositive ? '+' : ''}
                {crypto.priceChangePercentage24h.toFixed(2)}%
              </motion.div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.15 }}
                className="text-2xl font-bold text-slate-900 dark:text-white truncate"
              >
                {formatPrice(crypto.currentPrice)}
              </motion.div>
              <div className={`text-xs font-semibold mt-0.5 ${changeColor}`}>
                {isPositive ? '+' : ''}
                {formatPrice(Math.abs(crypto.priceChange24h))}
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
                      id={`crypto-performer-gradient-${crypto.id}`}
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
                    fill={`url(#crypto-performer-gradient-${crypto.id})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
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
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20 dark:border-white/10">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Market Cap</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {formatLargeNumber(crypto.marketCap)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">24h Volume</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {formatLargeNumber(crypto.totalVolume)}
              </p>
            </div>
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

