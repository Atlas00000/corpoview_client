'use client'

import { motion } from 'framer-motion'
import EnhancedFXPairCard from './EnhancedFXPairCard'
import { useLatestRates } from '@/lib/hooks/useFXData'
import { SlideUp, Skeleton } from '@/components/effects'

const FX_PAIRS = [
  { from: 'EUR', to: 'USD', label: 'EUR/USD' },
  { from: 'GBP', to: 'USD', label: 'GBP/USD' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY' },
  { from: 'USD', to: 'CAD', label: 'USD/CAD' },
  { from: 'USD', to: 'AUD', label: 'USD/AUD' },
  { from: 'EUR', to: 'GBP', label: 'EUR/GBP' },
  { from: 'USD', to: 'CHF', label: 'USD/CHF' },
]

export default function EnhancedFXPairsGrid() {
  const { rates, isLoading } = useLatestRates('USD')

  if (isLoading) {
    return (
      <SlideUp>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {FX_PAIRS.map((pair) => (
            <Skeleton key={pair.label} height={144} className="rounded-3xl" />
          ))}
        </div>
      </SlideUp>
    )
  }

  if (!rates) return null

  return (
    <div className="space-y-6">
      <SlideUp delay={0.1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Major Currency Pairs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Base Currency
                </p>
                <motion.p
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  USD
                </motion.p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Updated: {new Date(rates.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Available Rates
                </p>
                <motion.p
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {Object.keys(rates.rates).length} currencies
                </motion.p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Exchange Date
                </p>
                <motion.p
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {new Date(rates.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </SlideUp>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      >
        {FX_PAIRS.map((pair, index) => (
          <EnhancedFXPairCard
            key={pair.label}
            from={pair.from}
            to={pair.to}
            label={pair.label}
            index={index}
            rates={rates}
          />
        ))}
      </motion.div>
    </div>
  )
}

