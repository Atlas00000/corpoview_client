'use client'

import { useMemo } from 'react'
import { useStockDaily, useStockQuote } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts'
import { IconTrendingUp, IconAlertCircle } from '@/components/icons'

export interface VolatilityIndicatorsProps {
  symbol: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function calculateVolatility(prices: number[]): {
  volatility: number
  dailyReturns: number[]
  avgVolatility: number
  maxVolatility: number
  minVolatility: number
} {
  if (prices.length < 2) {
    return {
      volatility: 0,
      dailyReturns: [],
      avgVolatility: 0,
      maxVolatility: 0,
      minVolatility: 0,
    }
  }

  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] > 0) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
    }
  }

  if (returns.length === 0) {
    return {
      volatility: 0,
      dailyReturns: [],
      avgVolatility: 0,
      maxVolatility: 0,
      minVolatility: 0,
    }
  }

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const volatility = Math.sqrt(variance) * 100

  const rollingVolatilities = []
  const window = 10
  for (let i = window; i < returns.length; i++) {
    const windowReturns = returns.slice(i - window, i)
    const windowAvg = windowReturns.reduce((sum, r) => sum + r, 0) / windowReturns.length
    const windowVariance = windowReturns.reduce((sum, r) => sum + Math.pow(r - windowAvg, 2), 0) / windowReturns.length
    rollingVolatilities.push(Math.sqrt(windowVariance) * 100)
  }

  return {
    volatility,
    dailyReturns: returns,
    avgVolatility: rollingVolatilities.length > 0
      ? rollingVolatilities.reduce((sum, v) => sum + v, 0) / rollingVolatilities.length
      : volatility,
    maxVolatility: rollingVolatilities.length > 0 ? Math.max(...rollingVolatilities) : volatility,
    minVolatility: rollingVolatilities.length > 0 ? Math.min(...rollingVolatilities) : volatility,
  }
}

export default function VolatilityIndicators({ symbol }: VolatilityIndicatorsProps) {
  const { data: priceData, isLoading } = useStockDaily(symbol, 'compact')
  const { quote } = useStockQuote(symbol)

  const volatilityMetrics = useMemo(() => {
    if (!priceData || priceData.length === 0) {
      return {
        volatility: 0,
        dailyReturns: [],
        avgVolatility: 0,
        maxVolatility: 0,
        minVolatility: 0,
      }
    }

    const prices = priceData.map((d) => d.close)
    return calculateVolatility(prices)
  }, [priceData])

  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) return []

    const prices = priceData.map((d) => d.close)
    const returns: number[] = []
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] > 0) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1] * 100)
      }
    }

    const rollingVolatilities = []
    const window = 10
    for (let i = window; i < returns.length; i++) {
      const windowReturns = returns.slice(i - window, i)
      const windowAvg = windowReturns.reduce((sum, r) => sum + r, 0) / windowReturns.length
      const windowVariance = windowReturns.reduce((sum, r) => sum + Math.pow(r - windowAvg, 2), 0) / windowReturns.length
      rollingVolatilities.push(Math.sqrt(windowVariance) * 100)
    }

    return priceData.slice(window + 1).map((item, index) => ({
      date: formatDate(item.date),
      volatility: rollingVolatilities[index] || 0,
      return: returns[index + window] || 0,
    })).slice(-30)
  }, [priceData])

  const volatilityCategory = useMemo(() => {
    if (volatilityMetrics.volatility < 15) return { label: 'Low', color: 'from-success-500 to-success-600' }
    if (volatilityMetrics.volatility < 30) return { label: 'Moderate', color: 'from-amber-500 to-amber-600' }
    if (volatilityMetrics.volatility < 50) return { label: 'High', color: 'from-orange-500 to-orange-600' }
    return { label: 'Very High', color: 'from-danger-500 to-danger-600' }
  }, [volatilityMetrics.volatility])

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (!priceData || priceData.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No volatility data available for {symbol}
          </p>
        </Card>
      </SlideUp>
    )
  }

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <IconAlertCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Volatility Indicators: {symbol}
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Volatility measures the degree of price variation over time, providing essential risk assessment metrics. Understanding volatility patterns helps investors gauge potential price swings, optimize position sizing, and align investments with risk tolerance. Lower volatility typically indicates more stable price movements, while higher volatility suggests greater price uncertainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${volatilityCategory.color} text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Volatility</p>
            <p className="text-3xl font-bold">{volatilityMetrics.volatility.toFixed(2)}%</p>
            <p className="text-xs opacity-80 mt-1">{volatilityCategory.label}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Average Volatility</p>
            <p className="text-3xl font-bold">{volatilityMetrics.avgVolatility.toFixed(2)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Max Volatility</p>
            <p className="text-3xl font-bold">{volatilityMetrics.maxVolatility.toFixed(2)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Min Volatility</p>
            <p className="text-3xl font-bold">{volatilityMetrics.minVolatility.toFixed(2)}%</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Rolling Volatility (10-Day Window)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="volatilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Volatility']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <ReferenceLine
                  y={volatilityMetrics.avgVolatility}
                  stroke="#64748b"
                  strokeDasharray="3 3"
                  label={{ value: 'Average', position: 'right', fill: '#64748b' }}
                />
                <Area
                  type="monotone"
                  dataKey="volatility"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#volatilityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Daily Returns Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Daily Return']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.return >= 0 ? '#10b981' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </SlideUp>
  )
}

