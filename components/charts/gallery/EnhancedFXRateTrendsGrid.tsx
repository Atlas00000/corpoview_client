'use client'

import { motion } from 'framer-motion'
import EnhancedFXRateTrendCard from './EnhancedFXRateTrendCard'
import { SlideUp } from '@/components/effects'

const FX_PAIRS = [
  { from: 'USD', to: 'EUR', defaultRange: '30d' as const },
  { from: 'USD', to: 'GBP', defaultRange: '90d' as const },
  { from: 'USD', to: 'JPY', defaultRange: '30d' as const },
  { from: 'USD', to: 'CNY', defaultRange: '90d' as const },
]

export default function EnhancedFXRateTrendsGrid() {
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
              Foreign Exchange Rate Trends
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Real-time exchange rates with detailed currency pair information and interactive rate visualization
            </p>
          </div>
        </motion.div>
      </SlideUp>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {FX_PAIRS.map((pair, index) => (
          <EnhancedFXRateTrendCard
            key={`${pair.from}-${pair.to}`}
            from={pair.from}
            to={pair.to}
            defaultRange={pair.defaultRange}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  )
}

