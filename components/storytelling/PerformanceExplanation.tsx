'use client'

import { useMemo } from 'react'
import { useStockDaily, useStockQuote, useCompanyOverview } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { IconTrendingUp, IconTrendingDown, IconAlertCircle, IconInfoCircle } from '@/components/icons'

export interface PerformanceExplanationProps {
  symbol: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function calculatePerformanceMetrics(data: any[]) {
  if (!data || data.length < 2) {
    return {
      totalReturn: 0,
      volatility: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      bestDay: { date: '', return: 0 },
      worstDay: { date: '', return: 0 },
      avgDailyReturn: 0,
    }
  }

  const prices = data.map((d) => d.close)
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }

  const totalReturn = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
  const avgDailyReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgDailyReturn, 2), 0) / returns.length
  const volatility = Math.sqrt(variance) * 100

  const sharpeRatio = volatility > 0 ? (avgDailyReturn * 252) / (volatility * Math.sqrt(252)) : 0

  let maxDrawdown = 0
  let peak = prices[0]
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) peak = prices[i]
    const drawdown = ((peak - prices[i]) / peak) * 100
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }

  let bestDayIndex = 0
  let worstDayIndex = 0
  let bestReturn = returns[0]
  let worstReturn = returns[0]

  returns.forEach((ret, index) => {
    if (ret > bestReturn) {
      bestReturn = ret
      bestDayIndex = index + 1
    }
    if (ret < worstReturn) {
      worstReturn = ret
      worstDayIndex = index + 1
    }
  })

  return {
    totalReturn,
    volatility,
    sharpeRatio,
    maxDrawdown,
    bestDay: {
      date: data[bestDayIndex]?.date || '',
      return: bestReturn * 100,
    },
    worstDay: {
      date: data[worstDayIndex]?.date || '',
      return: worstReturn * 100,
    },
    avgDailyReturn: avgDailyReturn * 100,
  }
}

function generatePerformanceExplanation(
  metrics: ReturnType<typeof calculatePerformanceMetrics>,
  symbol: string,
  overview: any
): string {
  let explanation = `${symbol} has delivered a ${metrics.totalReturn >= 0 ? 'positive' : 'negative'} total return of ${metrics.totalReturn.toFixed(2)}% over the analyzed period. `

  if (metrics.volatility < 15) {
    explanation += 'The asset demonstrates relatively low volatility, indicating stable price movements and potentially lower risk profile. '
  } else if (metrics.volatility < 30) {
    explanation += 'The asset shows moderate volatility, reflecting normal market fluctuations with balanced risk-reward characteristics. '
  } else {
    explanation += 'The asset exhibits high volatility, suggesting significant price swings and higher risk potential. '
  }

  if (metrics.sharpeRatio > 1) {
    explanation += `With a Sharpe ratio of ${metrics.sharpeRatio.toFixed(2)}, the asset shows strong risk-adjusted returns, indicating efficient performance relative to volatility. `
  } else if (metrics.sharpeRatio > 0) {
    explanation += `The Sharpe ratio of ${metrics.sharpeRatio.toFixed(2)} indicates moderate risk-adjusted performance. `
  } else {
    explanation += `The negative Sharpe ratio suggests the asset has underperformed relative to its volatility. `
  }

  if (metrics.maxDrawdown > 20) {
    explanation += `The maximum drawdown of ${metrics.maxDrawdown.toFixed(2)}% represents significant downside risk, which investors should consider in their risk management strategies. `
  } else if (metrics.maxDrawdown > 10) {
    explanation += `The maximum drawdown of ${metrics.maxDrawdown.toFixed(2)}% is within acceptable ranges for most investment strategies. `
  } else {
    explanation += `The low maximum drawdown of ${metrics.maxDrawdown.toFixed(2)}% demonstrates strong downside protection. `
  }

  return explanation.trim()
}

export default function PerformanceExplanation({ symbol }: PerformanceExplanationProps) {
  const { data: priceData, isLoading } = useStockDaily(symbol, 'compact')
  const { quote } = useStockQuote(symbol)
  const { overview } = useCompanyOverview(symbol)

  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) return []
    return priceData.slice(-30).map((item) => ({
      date: formatDate(item.date),
      price: item.close,
      fullDate: item.date,
    }))
  }, [priceData])

  const metrics = useMemo(() => calculatePerformanceMetrics(priceData || []), [priceData])
  const explanation = useMemo(() => generatePerformanceExplanation(metrics, symbol, overview), [metrics, symbol, overview])

  const averagePrice = useMemo(() => {
    if (!chartData.length) return 0
    return chartData.reduce((sum, item) => sum + item.price, 0) / chartData.length
  }, [chartData])

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
            No performance data available for {symbol}
          </p>
        </Card>
      </SlideUp>
    )
  }

  const currentPrice = quote?.price || chartData[chartData.length - 1]?.price || 0

  const metricCards = [
    {
      label: 'Total Return',
      value: `${metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(2)}%`,
      color: metrics.totalReturn >= 0 ? 'from-success-500 to-success-600' : 'from-danger-500 to-danger-600',
      icon: metrics.totalReturn >= 0 ? IconTrendingUp : IconTrendingDown,
    },
    {
      label: 'Volatility',
      value: `${metrics.volatility.toFixed(2)}%`,
      color: 'from-blue-500 to-blue-600',
      icon: IconInfoCircle,
    },
    {
      label: 'Sharpe Ratio',
      value: metrics.sharpeRatio.toFixed(2),
      color: metrics.sharpeRatio > 1 ? 'from-emerald-500 to-emerald-600' : 'from-amber-500 to-amber-600',
      icon: IconInfoCircle,
    },
    {
      label: 'Max Drawdown',
      value: `${metrics.maxDrawdown.toFixed(2)}%`,
      color: metrics.maxDrawdown > 20 ? 'from-danger-500 to-danger-600' : 'from-purple-500 to-purple-600',
      icon: IconAlertCircle,
    },
  ]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Performance Explanation: {symbol}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Detailed performance analysis with key metrics including total returns, volatility, Sharpe ratio, and maximum drawdown. Our explanation provides context for performance metrics, helping you understand risk-adjusted returns and make informed decisions about asset allocation and risk management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metricCards.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${metric.color} text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="w-5 h-5 opacity-90" />
                </div>
                <p className="text-sm font-medium opacity-90 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <ReferenceLine
                y={averagePrice}
                stroke="#64748b"
                strokeDasharray="3 3"
                label={{ value: 'Average', position: 'right', fill: '#64748b' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={metrics.totalReturn >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 mb-6"
        >
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Performance Analysis
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {explanation}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Best Day</p>
              <p className="font-semibold text-success-600 dark:text-success-400">
                {formatDate(metrics.bestDay.date)}: +{metrics.bestDay.return.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Worst Day</p>
              <p className="font-semibold text-danger-600 dark:text-danger-400">
                {formatDate(metrics.worstDay.date)}: {metrics.worstDay.return.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Daily Return</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {metrics.avgDailyReturn >= 0 ? '+' : ''}
                {metrics.avgDailyReturn.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>
      </Card>
    </SlideUp>
  )
}

