'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { StockQuote } from '@/lib/hooks/useStockData'

export interface StockMoverCardProps {
  quote: StockQuote
  rank: number
  index: number
  name?: string
}

export default function StockMoverCard({ quote, rank, index, name }: StockMoverCardProps) {
  const isPositive = quote.changePercent >= 0
  const changeColor = isPositive
    ? 'text-success-600 dark:text-success-500'
    : 'text-danger-600 dark:text-danger-500'

  const bgGradient = isPositive
    ? 'from-success-50/50 via-white to-white dark:from-success-900/10 dark:via-slate-800 dark:to-slate-800'
    : 'from-danger-50/50 via-white to-white dark:from-danger-900/10 dark:via-slate-800 dark:to-slate-800'

  const borderColor = isPositive
    ? 'border-success-200 dark:border-success-800 hover:border-success-300 dark:hover:border-success-700'
    : 'border-danger-200 dark:border-danger-800 hover:border-danger-300 dark:hover:border-danger-700'

  const hoverShadow = isPositive
    ? 'hover:shadow-success-500/10'
    : 'hover:shadow-danger-500/10'

  const hoverGradient = isPositive
    ? 'group-hover:from-success-500/5 group-hover:via-success-500/3 group-hover:to-success-500/5'
    : 'group-hover:from-danger-500/5 group-hover:via-danger-500/3 group-hover:to-danger-500/5'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="relative group"
    >
      <Link
        href={`/stocks/${quote.symbol}`}
        className={`relative block p-4 rounded-2xl bg-gradient-to-br ${bgGradient} border ${borderColor} transition-all duration-300 hover:shadow-xl ${hoverShadow} hover:-translate-y-1 overflow-hidden group`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${isPositive ? 'from-success-500/0 via-success-500/0 to-success-500/0' : 'from-danger-500/0 via-danger-500/0 to-danger-500/0'} ${hoverGradient} transition-all duration-500`}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{rank}</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {quote.symbol}
                </h3>
                {name && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {name}
                  </p>
                )}
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
                {quote.changePercent.toFixed(2)}%
              </motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Price</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                ${quote.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Volume</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {(quote.volume / 1e6).toFixed(2)}M
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Day Range</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                ${quote.low.toFixed(2)} - ${quote.high.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Change</span>
              <span className={`font-semibold ${changeColor}`}>
                {isPositive ? '+' : ''}
                ${quote.change.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

