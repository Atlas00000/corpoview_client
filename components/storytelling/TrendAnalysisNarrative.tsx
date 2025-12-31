'use client'

import { useMemo } from 'react'
import { useStockDaily, useStockQuote } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { IconTrendingUp, IconTrendingDown, IconActivity } from '@/components/icons'

export interface TrendAnalysisNarrativeProps {
  symbol: string
  period?: '7d' | '30d' | '90d' | '1y'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function calculateTrend(data: any[]): {
  direction: 'up' | 'down' | 'sideways'
  percentage: number
  volatility: number
  momentum: number
} {
  if (!data || data.length < 2) {
    return { direction: 'sideways', percentage: 0, volatility: 0, momentum: 0 }
  }

  const prices = data.map((d) => d.close)
  const firstPrice = prices[0]
  const lastPrice = prices[prices.length - 1]
  const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100

  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const volatility = Math.sqrt(variance) * 100

  const recentReturns = returns.slice(-5)
  const earlierReturns = returns.slice(0, -5)
  const recentAvg = recentReturns.reduce((sum, r) => sum + r, 0) / recentReturns.length
  const earlierAvg = earlierReturns.length > 0
    ? earlierReturns.reduce((sum, r) => sum + r, 0) / earlierReturns.length
    : recentAvg
  const momentum = (recentAvg - earlierAvg) * 100

  return {
    direction: changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'sideways',
    percentage: changePercent,
    volatility: volatility,
    momentum: momentum,
  }
}

function generateNarrative(trend: ReturnType<typeof calculateTrend>, symbol: string): string {
  if (trend.direction === 'up') {
    if (trend.momentum > 0.5) {
      return `${symbol} has demonstrated strong upward momentum, gaining ${trend.percentage.toFixed(2)}% over the period. The asset is showing accelerating growth patterns with increasing buyer interest and positive momentum indicators suggesting continued upward pressure.`
    } else {
      return `${symbol} has gained ${trend.percentage.toFixed(2)}% over the period, indicating steady appreciation. While the trend remains positive, momentum has moderated, suggesting a potential consolidation phase before the next move.`
    }
  } else if (trend.direction === 'down') {
    if (trend.momentum < -0.5) {
      return `${symbol} has experienced downward pressure, declining ${Math.abs(trend.percentage).toFixed(2)}% over the period. The asset is showing accelerating negative momentum with increasing selling pressure, suggesting continued weakness in the near term.`
    } else {
      return `${symbol} has declined ${Math.abs(trend.percentage).toFixed(2)}% over the period. While the trend is negative, momentum has stabilized, potentially indicating a bottoming formation or consolidation phase.`
    }
  } else {
    return `${symbol} has moved ${Math.abs(trend.percentage).toFixed(2)}% in a relatively sideways pattern, indicating consolidation. The asset is trading within a range with moderate volatility, suggesting indecision between buyers and sellers as they assess fundamental factors.`
  }
}

export default function TrendAnalysisNarrative({ symbol, period = '30d' }: TrendAnalysisNarrativeProps) {
  const { data: priceData, isLoading } = useStockDaily(symbol, 'compact')
  const { quote } = useStockQuote(symbol)

  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) return []

    let filteredData = priceData
    if (period === '7d') filteredData = priceData.slice(-7)
    else if (period === '30d') filteredData = priceData.slice(-30)
    else if (period === '90d') filteredData = priceData.slice(-90)

    return filteredData.map((item) => ({
      date: formatDate(item.date),
      price: item.close,
      volume: item.volume,
      fullDate: item.date,
    }))
  }, [priceData, period])

  const trend = useMemo(() => calculateTrend(priceData || []), [priceData])
  const narrative = useMemo(() => generateNarrative(trend, symbol), [trend, symbol])

  const averagePrice = useMemo(() => {
    if (!chartData.length) return 0
    return chartData.reduce((sum, item) => sum + item.price, 0) / chartData.length
  }, [chartData])

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={500} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (!priceData || priceData.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No trend data available for {symbol}
          </p>
        </Card>
      </SlideUp>
    )
  }

  const currentPrice = quote?.price || chartData[chartData.length - 1]?.price || 0

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Trend Analysis: {symbol}
            </h3>
            <div className="flex items-center gap-2">
              {trend.direction === 'up' && (
                <IconTrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
              )}
              {trend.direction === 'down' && (
                <IconTrendingDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
              )}
              {trend.direction === 'sideways' && (
                <IconActivity className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              )}
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Comprehensive trend analysis combines quantitative metrics with narrative insights to explain price movements and market dynamics. Our analysis examines price changes, volatility patterns, and momentum indicators to provide context for current market conditions and future potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl ${
              trend.direction === 'up'
                ? 'bg-gradient-to-br from-success-500 to-success-600'
                : trend.direction === 'down'
                ? 'bg-gradient-to-br from-danger-500 to-danger-600'
                : 'bg-gradient-to-br from-slate-500 to-slate-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Price Change</p>
            <p className="text-3xl font-bold">
              {trend.percentage >= 0 ? '+' : ''}
              {trend.percentage.toFixed(2)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Volatility</p>
            <p className="text-3xl font-bold">{trend.volatility.toFixed(2)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-5 rounded-2xl ${
              trend.momentum > 0.5
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                : trend.momentum < -0.5
                ? 'bg-gradient-to-br from-rose-500 to-rose-600'
                : 'bg-gradient-to-br from-amber-500 to-amber-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Momentum</p>
            <p className="text-3xl font-bold">
              {trend.momentum >= 0 ? '+' : ''}
              {trend.momentum.toFixed(2)}%
            </p>
          </motion.div>
        </div>

        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`colorPrice-${symbol}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      trend.direction === 'up'
                        ? '#10b981'
                        : trend.direction === 'down'
                        ? '#f43f5e'
                        : '#64748b'
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      trend.direction === 'up'
                        ? '#10b981'
                        : trend.direction === 'down'
                        ? '#f43f5e'
                        : '#64748b'
                    }
                    stopOpacity={0}
                  />
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
              <Area
                type="monotone"
                dataKey="price"
                stroke={
                  trend.direction === 'up'
                    ? '#10b981'
                    : trend.direction === 'down'
                    ? '#f43f5e'
                    : '#64748b'
                }
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#colorPrice-${symbol})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
        >
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Narrative Analysis
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {narrative}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Current Price</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  ${currentPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Average Price</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  ${averagePrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Price Deviation</p>
                <p
                  className={`font-semibold ${
                    currentPrice > averagePrice
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-danger-600 dark:text-danger-400'
                  }`}
                >
                  {currentPrice > averagePrice ? '+' : ''}
                  {(((currentPrice - averagePrice) / averagePrice) * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Data Points</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {chartData.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Card>
    </SlideUp>
  )
}

