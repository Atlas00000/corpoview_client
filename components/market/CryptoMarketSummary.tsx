'use client'

import { useGlobalCryptoData } from '@/lib/hooks/useCryptoData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { TrendIndicator } from '@/components/data'

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function CryptoMarketSummary() {
  const { global, isLoading } = useGlobalCryptoData()

  if (isLoading) {
    return (
      <SlideUp>
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 dark:from-slate-800 dark:via-primary-900/20 dark:to-secondary-900/20 border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Skeleton width={150} height={24} className="rounded-lg" />
              <Skeleton width={100} height={20} className="rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton width={80} height={16} className="rounded mb-2" />
                <Skeleton width={120} height={32} className="rounded-lg" />
              </div>
              <div>
                <Skeleton width={80} height={16} className="rounded mb-2" />
                <Skeleton width={120} height={32} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </SlideUp>
    )
  }

  if (!global) return null

  const marketCapChange = global.marketCapChangePercentage24hUsd || 0
  const isPositive = marketCapChange >= 0

  return (
    <SlideUp>
      <motion.div
        className="relative p-6 rounded-3xl bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 dark:from-slate-800 dark:via-primary-900/20 dark:to-secondary-900/20 border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/3 group-hover:to-secondary-500/5 transition-all duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                Cryptocurrency Market
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {global.activeCryptocurrencies.toLocaleString()} coins
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {global.markets.toLocaleString()} markets
                </span>
              </div>
            </div>
            <TrendIndicator
              value={marketCapChange}
              isPositive={isPositive}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Market Cap
              </p>
              <motion.p
                className="text-3xl font-bold text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {formatLargeNumber(global.totalMarketCap)}
              </motion.p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                24h Volume
              </p>
              <motion.p
                className="text-3xl font-bold text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {formatLargeNumber(global.totalVolume)}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </SlideUp>
  )
}

