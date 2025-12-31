'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CryptoMarketData } from '@/lib/hooks/useCryptoData'

export interface CryptoMoverCardProps {
  crypto: CryptoMarketData
  rank: number
  index: number
}

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`
  if (price >= 0.01) return `$${price.toFixed(4)}`
  return `$${price.toFixed(6)}`
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function CryptoMoverCard({ crypto, rank, index }: CryptoMoverCardProps) {
  const isPositive = crypto.priceChangePercentage24h >= 0
  const changeColor = isPositive
    ? 'text-success-600 dark:text-success-500'
    : 'text-danger-600 dark:text-danger-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="relative group"
    >
      <Link
        href={`/crypto/${crypto.id}`}
        className="relative block p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/3 group-hover:to-secondary-500/5 transition-all duration-500" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {crypto.image && (
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {rank}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {crypto.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                  {crypto.symbol}
                </p>
              </div>
            </div>

            <div className={`text-right ${changeColor}`}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="text-lg font-bold"
              >
                {isPositive ? '+' : ''}
                {crypto.priceChangePercentage24h.toFixed(2)}%
              </motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Price</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {formatPrice(crypto.currentPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Market Cap</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatLargeNumber(crypto.marketCap)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">24h Volume</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatLargeNumber(crypto.totalVolume)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">24h Change</span>
              <span className={`font-semibold ${changeColor}`}>
                {isPositive ? '+' : ''}
                ${Math.abs(crypto.priceChange24h).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

