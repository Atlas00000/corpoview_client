'use client'

import { useMemo } from 'react'
import { useLatestRates, useHistoricalRates } from '@/lib/hooks/useFXData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell } from 'recharts'
import { IconTrendingUp, IconTrendingDown } from '@/components/icons'

export interface FXComparisonProps {
  pairs: string[]
  baseCurrency?: string
}

function parsePair(pair: string): { from: string; to: string } {
  const [from, to] = pair.split('/')
  return { from: from || 'USD', to: to || 'EUR' }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function normalizeToPercentage(data: number[]): number[] {
  if (!data || data.length === 0) return []
  const firstValue = data[0]
  if (firstValue === 0) return data
  return data.map((value) => ((value - firstValue) / firstValue) * 100)
}

export default function FXComparison({ pairs, baseCurrency = 'USD' }: FXComparisonProps) {
  const { rates, isLoading: ratesLoading } = useLatestRates(baseCurrency)

  const isLoading = ratesLoading

  const currentRates = useMemo(() => {
    if (!rates?.rates) return []

    return pairs.map((pair) => {
      const { from, to } = parsePair(pair)
      let rate = 0

      if (from === baseCurrency && rates.rates[to]) {
        rate = rates.rates[to]
      } else if (to === baseCurrency && rates.rates[from]) {
        rate = 1 / rates.rates[from]
      } else if (rates.rates[from] && rates.rates[to]) {
        rate = rates.rates[to] / rates.rates[from]
      }

      return {
        pair,
        from,
        to,
        rate,
        displayRate: rate > 0 ? `1 ${from} = ${rate.toFixed(4)} ${to}` : 'N/A',
      }
    }).filter((item) => item.rate > 0)
  }, [pairs, rates, baseCurrency])

  const comparisonData = useMemo(() => {
    return []
  }, [])

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            FX Pair Comparison: {pairs.join(' vs ')}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Compare foreign exchange rates across different currency pairs to understand relative currency strength, identify trends, and make informed decisions about currency exposure and international investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {currentRates.map((pair, index) => (
            <motion.div
              key={pair.pair}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
            >
              <p className="text-sm font-medium opacity-90 mb-2">{pair.pair}</p>
              <p className="text-2xl font-bold mb-1">{pair.rate.toFixed(4)}</p>
              <p className="text-xs opacity-80">{pair.displayRate}</p>
            </motion.div>
          ))}
        </div>


        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Current Exchange Rates
          </h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Currency Pair
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Exchange Rate
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Base Currency
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Quote Currency
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRates.map((pair) => (
                <tr
                  key={pair.pair}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {pair.pair}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                    {pair.rate.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pair.from}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pair.to}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </SlideUp>
  )
}

