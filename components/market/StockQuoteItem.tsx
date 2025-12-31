'use client'

import { useStockQuote } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { TrendIndicator } from '@/components/data'
import Link from 'next/link'

export interface StockQuoteItemProps {
  symbol: string
  name?: string
  index: number
}

export default function StockQuoteItem({ symbol, name, index }: StockQuoteItemProps) {
  const { quote, isLoading } = useStockQuote(symbol)

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative group"
      >
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </motion.div>
    )
  }

  if (!quote) return null

  const isPositive = quote.changePercent >= 0
  const changeColor = isPositive ? 'text-success-600' : 'text-danger-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
      className="relative group"
    >
      <Link
        href={`/stocks/${symbol}`}
        className="block p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              {symbol}
            </h3>
            {name && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {name}
              </p>
            )}
          </div>
          <div className={`text-right ${changeColor}`}>
            <span className="text-xs font-semibold">
              {isPositive ? '+' : ''}
              {quote.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${quote.price.toFixed(2)}
          </span>
          <span className={`text-sm font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}
            {quote.change.toFixed(2)}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  )
}

