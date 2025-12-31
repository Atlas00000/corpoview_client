'use client'

import { useMemo } from 'react'
import { useStockDaily, useStockQuote } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
import { IconTrendingUp } from '@/components/icons'

export interface PerformanceAttributionProps {
  symbol: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function PerformanceAttribution({ symbol }: PerformanceAttributionProps) {
  const { data: priceData, isLoading } = useStockDaily(symbol, 'compact')
  const { quote } = useStockQuote(symbol)

  const performanceBreakdown = useMemo(() => {
    if (!priceData || priceData.length === 0) {
      return {
        totalReturn: 0,
        periodReturns: [],
        weeklyReturns: [],
        monthlyReturn: 0,
        volatilityContribution: 0,
      }
    }

    const prices = priceData.map((d) => d.close)
    const volumes = priceData.map((d) => d.volume)
    const totalReturn = prices.length > 1
      ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
      : 0

    const periodReturns: Array<{ period: string; return: number; contribution: number }> = []
    const periodSize = 5
    for (let i = 0; i < prices.length - periodSize; i += periodSize) {
      const periodReturn = prices[i + periodSize] > 0
        ? ((prices[i + periodSize] - prices[i]) / prices[i]) * 100
        : 0
      const contribution = totalReturn !== 0 ? (periodReturn / totalReturn) * 100 : 0
      periodReturns.push({
        period: `Period ${Math.floor(i / periodSize) + 1}`,
        return: periodReturn,
        contribution: contribution,
      })
    }

    const weeklyReturns: Array<{ week: string; return: number }> = []
    for (let i = 7; i < prices.length; i += 7) {
      const weekReturn = prices[i - 7] > 0
        ? ((prices[i] - prices[i - 7]) / prices[i - 7]) * 100
        : 0
      weeklyReturns.push({
        week: formatDate(priceData[i].date),
        return: weekReturn,
      })
    }

    const monthlyReturn = prices.length >= 20
      ? ((prices[prices.length - 1] - prices[prices.length - 20]) / prices[prices.length - 20]) * 100
      : 0

    const returns: number[] = []
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] > 0) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
      }
    }
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const volatility = Math.sqrt(variance) * 100
    const volatilityContribution = totalReturn !== 0 ? (volatility / Math.abs(totalReturn)) * 100 : 0

    return {
      totalReturn,
      periodReturns,
      weeklyReturns,
      monthlyReturn,
      volatilityContribution,
    }
  }, [priceData])

  const attributionFactors = useMemo(() => {
    const factors = [
      {
        name: 'Price Appreciation',
        value: Math.abs(performanceBreakdown.totalReturn),
        contribution: performanceBreakdown.totalReturn >= 0 ? 100 : 0,
        color: COLORS[0],
      },
      {
        name: 'Volatility Impact',
        value: performanceBreakdown.volatilityContribution,
        contribution: performanceBreakdown.volatilityContribution,
        color: COLORS[1],
      },
      {
        name: 'Trend Component',
        value: Math.abs(performanceBreakdown.totalReturn) * 0.3,
        contribution: 30,
        color: COLORS[2],
      },
    ]
    return factors
  }, [performanceBreakdown])

  const currentPrice = quote?.price || (priceData && priceData.length > 0 ? priceData[priceData.length - 1].close : 0)
  const startPrice = priceData && priceData.length > 0 ? priceData[0].close : currentPrice

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

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <IconTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Performance Attribution: {symbol}
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Performance attribution breaks down returns into contributing factors, helping you understand what drives asset performance. By analyzing price appreciation, volatility impact, and trend components, you can identify which factors are most influential and make more informed investment decisions based on performance drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl ${
              performanceBreakdown.totalReturn >= 0
                ? 'bg-gradient-to-br from-success-500 to-success-600'
                : 'bg-gradient-to-br from-danger-500 to-danger-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Total Return</p>
            <p className="text-3xl font-bold">
              {performanceBreakdown.totalReturn >= 0 ? '+' : ''}
              {performanceBreakdown.totalReturn.toFixed(2)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Price Change</p>
            <p className="text-2xl font-bold">
              ${(currentPrice - startPrice).toFixed(2)}
            </p>
            <p className="text-xs opacity-80 mt-1">
              ${startPrice.toFixed(2)} → ${currentPrice.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-5 rounded-2xl ${
              performanceBreakdown.monthlyReturn >= 0
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                : 'bg-gradient-to-br from-rose-500 to-rose-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">30-Day Return</p>
            <p className="text-3xl font-bold">
              {performanceBreakdown.monthlyReturn >= 0 ? '+' : ''}
              {performanceBreakdown.monthlyReturn.toFixed(2)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Periods Analyzed</p>
            <p className="text-3xl font-bold">{performanceBreakdown.periodReturns.length}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Performance Attribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attributionFactors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, contribution }) => `${name}: ${contribution.toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="contribution"
                >
                  {attributionFactors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Period Contribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceBreakdown.periodReturns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="period"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="contribution" radius={[4, 4, 0, 0]}>
                  {performanceBreakdown.periodReturns.map((entry, index) => (
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

        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Weekly Returns Trend
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceBreakdown.weeklyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="week"
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
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Weekly Return']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="return"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </SlideUp>
  )
}

