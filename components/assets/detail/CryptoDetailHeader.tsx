'use client'

import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { TrendIndicator } from '@/components/data'
import Image from 'next/image'

export interface CryptoDetailHeaderProps {
  cryptoId: string
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`
  if (price >= 0.01) return `$${price.toFixed(4)}`
  return `$${price.toFixed(6)}`
}

export default function CryptoDetailHeader({ cryptoId }: CryptoDetailHeaderProps) {
  const { markets, isLoading } = useCryptoMarkets('usd', undefined, 100)

  const crypto = markets?.find((coin) => coin.id === cryptoId)

  if (isLoading) {
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

  if (!crypto) return null

  const isPositive = crypto.priceChangePercentage24h >= 0
  const changeColor = isPositive
    ? 'text-success-600 dark:text-success-500'
    : 'text-danger-600 dark:text-danger-500'

  const metrics = [
    {
      label: 'Market Cap',
      value: formatLargeNumber(crypto.marketCap),
    },
    {
      label: '24h Volume',
      value: formatLargeNumber(crypto.totalVolume),
    },
    {
      label: '24h High',
      value: formatPrice(crypto.high24h),
    },
    {
      label: '24h Low',
      value: formatPrice(crypto.low24h),
    },
    {
      label: 'Market Cap Rank',
      value: `#${crypto.marketCapRank}`,
    },
    {
      label: '24h Change',
      value: `${isPositive ? '+' : ''}${crypto.priceChangePercentage24h.toFixed(2)}%`,
      change: crypto.priceChangePercentage24h,
    },
  ]

  return (
    <SlideUp>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {crypto.image && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              >
                <Image
                  src={crypto.image}
                  alt={crypto.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </motion.div>
            )}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2"
              >
                {crypto.name}
              </motion.h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                  {crypto.symbol.toUpperCase()}
                </p>
                {crypto.marketCapRank && (
                  <>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      Rank #{crypto.marketCapRank}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2"
            >
              {formatPrice(crypto.currentPrice)}
            </motion.div>
            <div className="flex items-center justify-end gap-2">
              <TrendIndicator
                value={crypto.priceChangePercentage24h}
                isPositive={isPositive}
                size="lg"
              />
            </div>
            <p className={`text-lg font-semibold mt-1 ${changeColor}`}>
              {isPositive ? '+' : ''}
              ${crypto.priceChange24h.toFixed(2)}
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
                <p
                  className={`text-xl font-bold ${
                    metric.change !== undefined
                      ? changeColor
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
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

