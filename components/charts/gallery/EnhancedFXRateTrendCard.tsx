'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLatestRates, ExchangeRates } from '@/lib/hooks/useFXData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { IconTrendingUp, IconTrendingDown, IconArrowRight } from '@/components/icons'
import { SlideUp, Skeleton } from '@/components/effects'

export type TimeRange = '7d' | '30d' | '90d' | '1y'

export interface EnhancedFXRateTrendCardProps {
  from: string
  to: string
  defaultRange?: TimeRange
  index: number
}

function formatRate(rate: number, to: string): string {
  const decimals = to === 'JPY' ? 2 : 4
  return rate.toFixed(decimals)
}

function getDaysFromRange(range: TimeRange): number {
  switch (range) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '1y':
      return 365
    default:
      return 30
  }
}

export default function EnhancedFXRateTrendCard({
  from,
  to,
  defaultRange = '30d',
  index,
}: EnhancedFXRateTrendCardProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange)
  const [previousRate, setPreviousRate] = useState<number | null>(null)
  const { rates, isLoading } = useLatestRates(from)

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

  const currentRate = rates ? getRate(from, to, rates) : null
  const change = currentRate !== null && previousRate !== null ? currentRate - previousRate : 0
  const changePercent = currentRate !== null && previousRate !== null && previousRate !== 0
    ? (change / previousRate) * 100
    : 0

  const isPositive = changePercent >= 0
  const gradientFrom = isPositive
    ? 'from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20'
    : 'from-rose-50 via-pink-50 to-rose-100 dark:from-rose-500/20 dark:via-pink-500/20 dark:to-rose-600/20'

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
        className="relative h-[500px] rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 animate-pulse"
      />
    )
  }

  if (!currentRate || !rates) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ scale: 1.01 }}
      className="relative group"
    >
      <Link
        href={`/fx/${from}/${to}`}
        className="block relative rounded-3xl bg-gradient-to-br ${gradientFrom} p-6 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {from}
                </div>
                <IconArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {to}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {from}/{to}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Exchange Rate
                </p>
                {rates.date && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Updated: {new Date(rates.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {changePercent !== 0 && (
              <div className={`text-right ml-4 ${isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center gap-2"
                >
                  {isPositive ? (
                    <IconTrendingUp className="w-5 h-5" />
                  ) : (
                    <IconTrendingDown className="w-5 h-5" />
                  )}
                  <div>
                    <div className="text-lg font-bold">
                      {isPositive ? '+' : ''}
                      {changePercent.toFixed(3)}%
                    </div>
                    <div className="text-xs font-semibold">
                      {isPositive ? '+' : ''}
                      {formatRate(Math.abs(change), to)}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Current Rate</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatRate(currentRate, to)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                1 {from} = {formatRate(currentRate, to)} {to}
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Inverse Rate</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatRate(1 / currentRate, from)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                1 {to} = {formatRate(1 / currentRate, from)} {from}
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Base Currency</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {from}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                United States Dollar
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Quote Currency</p>
              <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                {to}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {to === 'EUR' ? 'Euro' : to === 'GBP' ? 'British Pound' : to === 'JPY' ? 'Japanese Yen' : to === 'CNY' ? 'Chinese Yuan' : 'Currency'}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(['30d', '90d'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setRange(r)
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    range === r
                      ? 'bg-white/80 dark:bg-white/20 text-slate-900 dark:text-white shadow-lg'
                      : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 dark:text-slate-400">Exchange Date</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {rates.date ? new Date(rates.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 overflow-hidden">
            <div className="h-[300px] flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                >
                  {formatRate(currentRate, to)}
                </motion.div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Current Exchange Rate
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Currency Pair</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{from}/{to}</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isPositive ? 'bg-gradient-to-r from-success-500 to-emerald-500' : 'bg-gradient-to-r from-danger-500 to-rose-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 1 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-slate-600 dark:text-slate-400">
                  <span>Rate Strength</span>
                  <span className="font-semibold">{isPositive ? 'Strong' : 'Weak'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPositive ? (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/10 group-hover:to-pink-500/10 rounded-3xl transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        )}

        <motion.div
          className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/20 dark:group-hover:bg-white/5 transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </Link>
    </motion.div>
  )
}

