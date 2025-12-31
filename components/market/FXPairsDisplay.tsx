'use client'

import { useLatestRates } from '@/lib/hooks/useFXData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import Link from 'next/link'

const FX_PAIRS = [
  { from: 'EUR', to: 'USD', label: 'EUR/USD' },
  { from: 'GBP', to: 'USD', label: 'GBP/USD' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY' },
]

export default function FXPairsDisplay() {
  const { rates, isLoading } = useLatestRates('USD')

  if (isLoading) {
    return (
      <SlideUp>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {FX_PAIRS.map((pair) => (
            <Skeleton key={pair.label} height={100} className="rounded-2xl" />
          ))}
        </div>
      </SlideUp>
    )
  }

  if (!rates) return null

  const getRate = (from: string, to: string): number | null => {
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

  return (
    <SlideUp>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {FX_PAIRS.map((pair, index) => {
          const rate = getRate(pair.from, pair.to)
          if (!rate) return null

          return (
            <motion.div
              key={pair.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/fx/${pair.from}/${pair.to}`}
                className="relative block p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1 group overflow-hidden"
              >
                <div className="mb-2 relative z-10">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {pair.label}
                  </p>
                </div>
                <motion.p
                  className="text-2xl font-bold text-slate-900 dark:text-slate-100 relative z-10"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {rate.toFixed(pair.to === 'JPY' ? 2 : 4)}
                </motion.p>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SlideUp>
  )
}

