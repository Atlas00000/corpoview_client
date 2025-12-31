'use client'

import { useLatestRates, ExchangeRates } from '@/lib/hooks/useFXData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IconTrendingUp, IconTrendingDown, IconArrowRight } from '@/components/icons'
import { useState, useEffect } from 'react'

export interface EnhancedFXPairCardProps {
  from: string
  to: string
  label: string
  index: number
  rates?: ExchangeRates
}

function formatRate(rate: number, to: string): string {
  const decimals = to === 'JPY' ? 2 : 4
  return rate.toFixed(decimals)
}


export default function EnhancedFXPairCard({
  from,
  to,
  label,
  index,
  rates: providedRates,
}: EnhancedFXPairCardProps) {
  const { rates: fetchedRates } = useLatestRates('USD')
  const rates = providedRates || fetchedRates
  const [previousRate, setPreviousRate] = useState<number | null>(null)

  useEffect(() => {
    if (rates) {
      const currentRate = getRate(from, to, rates)
      if (currentRate !== null) {
        setPreviousRate((prev) => (prev === null ? currentRate : prev))
      }
    }
  }, [rates, from, to])

  const getRate = (fromCurr: string, toCurr: string, rateData: ExchangeRates): number | null => {
    if (fromCurr === 'USD' && rateData.rates[toCurr]) {
      return rateData.rates[toCurr]
    }
    if (toCurr === 'USD' && rateData.rates[fromCurr]) {
      return 1 / rateData.rates[fromCurr]
    }
    if (rateData.rates[fromCurr] && rateData.rates[toCurr]) {
      return rateData.rates[toCurr] / rateData.rates[fromCurr]
    }
    return null
  }

  if (!rates) return null

  const currentRate = getRate(from, to, rates)
  if (currentRate === null) return null

  const change = previousRate !== null ? currentRate - previousRate : 0
  const changePercent = previousRate !== null && previousRate !== 0
    ? (change / previousRate) * 100
    : 0

  const isPositive = changePercent >= 0
  const trend = changePercent > 0.001 ? 'up' : changePercent < -0.001 ? 'down' : 'neutral'
  
  const gradientFrom = isPositive
    ? 'from-success-50 via-emerald-50 to-success-100 dark:from-success-500/20 dark:via-emerald-500/20 dark:to-success-600/20'
    : 'from-danger-50 via-rose-50 to-danger-100 dark:from-danger-500/20 dark:via-rose-500/20 dark:to-danger-600/20'

  const [fromCurrency, toCurrency] = label.split('/')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group"
    >
      <Link
        href={`/fx/${from}/${to}`}
        className="block relative h-36 rounded-3xl bg-gradient-to-br ${gradientFrom} p-5 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {fromCurrency}
                    </div>
                    <IconArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {toCurrency}
                    </div>
                  </div>
                </div>
                {isPositive ? (
                  <IconTrendingUp className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
                ) : (
                  <IconTrendingDown className="w-4 h-4 text-danger-600 dark:text-danger-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {label}
              </p>
            </div>
            {changePercent !== 0 && (
              <div className={`text-right ml-2 ${isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.2 }}
                  className="text-sm font-bold"
                >
                  {isPositive ? '+' : ''}
                  {changePercent.toFixed(3)}%
                </motion.div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.15 }}
                className="text-2xl font-bold text-slate-900 dark:text-white"
              >
                {formatRate(currentRate, to)}
              </motion.div>
              {change !== 0 && (
                <div className={`text-xs font-semibold mt-0.5 ${isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                  {isPositive ? '+' : ''}
                  {formatRate(Math.abs(change), to)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <div className="flex flex-col items-end">
                <div className="w-12 h-6 flex items-center justify-center rounded-md bg-white/60 dark:bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${isPositive ? 'bg-success-500' : 'bg-danger-500'}`}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/20 dark:border-white/10">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Base</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                1 {from}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Quote</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {formatRate(currentRate, to)} {to}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/10 group-hover:to-secondary-500/10 rounded-3xl transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />

        <motion.div
          className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/20 dark:group-hover:bg-white/5 transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </Link>
    </motion.div>
  )
}

