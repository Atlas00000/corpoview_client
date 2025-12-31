'use client'

import { useLatestRates } from '@/lib/hooks/useFXData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'

export interface FXDetailHeaderProps {
  from: string
  to: string
}

function getRate(rates: any, from: string, to: string): number | null {
  if (!rates?.rates) return null
  
  if (from === 'USD' && rates.rates[to]) {
    return rates.rates[to]
  }
  if (to === 'USD' && rates.rates[from]) {
    return 1 / rates.rates[from]
  }
  if (rates.rates[from] && rates.rates[to]) {
    return rates.rates[to] / rates.rates[from]
  }
  return null
}

export default function FXDetailHeader({ from, to }: FXDetailHeaderProps) {
  const { rates, isLoading } = useLatestRates('USD')

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

  if (!rates) return null

  const rate = getRate(rates, from, to)
  if (!rate) return null

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
              {from}/{to}
            </motion.h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Currency Exchange Rate
            </p>
          </div>

          <div className="text-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2"
            >
              {rate.toFixed(to === 'JPY' ? 2 : 4)}
            </motion.div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date(rates.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Base Currency
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{from}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Quote Currency
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{to}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Exchange Rate
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              1 {from} = {rate.toFixed(to === 'JPY' ? 2 : 4)} {to}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Reverse Rate
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              1 {to} = {(1 / rate).toFixed(from === 'JPY' ? 2 : 4)} {from}
            </p>
          </div>
        </div>
      </div>
    </SlideUp>
  )
}

