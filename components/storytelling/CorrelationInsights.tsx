'use client'

import { useMemo } from 'react'
import { useStockDaily } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { IconLink, IconTrendingUp } from '@/components/icons'

export interface CorrelationInsightsProps {
  symbols: string[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function calculateCorrelation(data1: number[], data2: number[]): number {
  if (data1.length !== data2.length || data1.length < 2) return 0

  const n = data1.length
  const sum1 = data1.reduce((sum, val) => sum + val, 0)
  const sum2 = data2.reduce((sum, val) => sum + val, 0)
  const sum1Sq = data1.reduce((sum, val) => sum + val * val, 0)
  const sum2Sq = data2.reduce((sum, val) => sum + val * val, 0)
  const pSum = data1.reduce((sum, val, i) => sum + val * data2[i], 0)

  const num = pSum - (sum1 * sum2 / n)
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))

  if (den === 0) return 0
  return num / den
}

function normalizePrices(prices: number[]): number[] {
  if (prices.length === 0) return []
  const firstPrice = prices[0]
  if (firstPrice === 0) return prices
  return prices.map((price) => ((price - firstPrice) / firstPrice) * 100)
}

export default function CorrelationInsights({ symbols }: CorrelationInsightsProps) {
  const stockData = symbols.map((symbol) => useStockDaily(symbol, 'compact'))

  const isLoading = stockData.some((d) => d.isLoading)

  const normalizedData = useMemo(() => {
    if (!stockData[0]?.data || !stockData[1]?.data) return []

    const data1 = stockData[0].data.slice(-30).map((d) => d.close)
    const data2 = stockData[1].data.slice(-30).map((d) => d.close)

    const minLength = Math.min(data1.length, data2.length)
    const normalized1 = normalizePrices(data1.slice(0, minLength))
    const normalized2 = normalizePrices(data2.slice(0, minLength))

    return normalized1.map((price1, index) => ({
      x: price1,
      y: normalized2[index],
    }))
  }, [stockData])

  const correlation = useMemo(() => {
    if (!stockData[0]?.data || !stockData[1]?.data) return 0

    const data1 = stockData[0].data.slice(-30).map((d) => d.close)
    const data2 = stockData[1].data.slice(-30).map((d) => d.close)

    const minLength = Math.min(data1.length, data2.length)
    return calculateCorrelation(
      data1.slice(0, minLength),
      data2.slice(0, minLength)
    )
  }, [stockData])

  const comparisonData = useMemo(() => {
    if (!stockData[0]?.data || !stockData[1]?.data) return []

    const data1 = stockData[0].data.slice(-30)
    const data2 = stockData[1].data.slice(-30)

    const minLength = Math.min(data1.length, data2.length)
    const normalized1 = normalizePrices(data1.slice(0, minLength).map((d) => d.close))
    const normalized2 = normalizePrices(data2.slice(0, minLength).map((d) => d.close))

    return data1.slice(0, minLength).map((item, index) => ({
      date: formatDate(item.date),
      [symbols[0]]: normalized1[index],
      [symbols[1]]: normalized2[index],
    }))
  }, [stockData, symbols])

  const correlationStrength = useMemo(() => {
    const absCorr = Math.abs(correlation)
    if (absCorr > 0.7) return 'Strong'
    if (absCorr > 0.4) return 'Moderate'
    if (absCorr > 0.2) return 'Weak'
    return 'Very Weak'
  }, [correlation])

  const correlationDirection = correlation >= 0 ? 'Positive' : 'Negative'

  if (isLoading || symbols.length < 2) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <IconLink className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Correlation Insights: {symbols[0]} vs {symbols[1]}
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Correlation analysis reveals how two assets move in relation to each other, providing insights into portfolio diversification and risk management. Strong positive correlations suggest assets move together, while negative correlations indicate inverse relationships that can provide diversification benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl ${
              Math.abs(correlation) > 0.7
                ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                : Math.abs(correlation) > 0.4
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-slate-500 to-slate-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Correlation Coefficient</p>
            <p className="text-3xl font-bold">{correlation.toFixed(3)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-5 rounded-2xl ${
              correlation >= 0
                ? 'bg-gradient-to-br from-success-500 to-success-600'
                : 'bg-gradient-to-br from-danger-500 to-danger-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Direction</p>
            <p className="text-2xl font-bold">{correlationDirection}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Strength</p>
            <p className="text-2xl font-bold">{correlationStrength}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Correlation Scatter Plot
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={normalizedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={symbols[0]}
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: `${symbols[0]} (% Change)`, position: 'insideBottom', offset: -5, fill: '#64748b' }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={symbols[1]}
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: `${symbols[1]} (% Change)`, angle: -90, position: 'insideLeft', fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Scatter dataKey="y" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Normalized Price Comparison
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonData}>
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
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={symbols[0]}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={symbols[1]}
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
        >
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Correlation Analysis
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            The correlation coefficient of {correlation.toFixed(3)} indicates a {correlationStrength.toLowerCase()} {correlationDirection.toLowerCase()} correlation between {symbols[0]} and {symbols[1]}. 
            {correlation > 0.7
              ? ` This strong positive correlation suggests that these assets tend to move together, which could indicate similar market exposure, sector alignment, or shared market drivers. Investors seeking diversification may need to consider assets from different sectors or with different risk profiles.`
              : correlation > 0.4
              ? ` This moderate positive correlation indicates that while these assets often move in the same direction, there are still meaningful differences in their price movements. This moderate correlation can provide some diversification benefits while maintaining exposure to similar market themes.`
              : correlation > 0
              ? ` This weak positive correlation suggests limited relationship between these assets. The weak correlation indicates that the assets are relatively independent, which could be beneficial for portfolio diversification purposes.`
              : correlation > -0.4
              ? ` This weak negative correlation indicates that these assets tend to move in opposite directions occasionally. While the relationship is weak, it suggests potential diversification benefits in a portfolio context.`
              : ` This negative correlation suggests that these assets tend to move in opposite directions. This can provide strong diversification benefits, as gains in one asset may offset losses in the other during certain market conditions.`}
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <IconTrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Correlation values range from -1 (perfect negative correlation) to +1 (perfect positive correlation). Values closer to zero indicate weaker relationships.
            </p>
          </div>
        </motion.div>
      </Card>
    </SlideUp>
  )
}

