'use client'

import { useMemo } from 'react'
import { useStockDaily } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { IconChartBar } from '@/components/icons'

export interface CorrelationAnalysisProps {
  symbols: string[]
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

function normalizeToPercentage(data: number[]): number[] {
  if (!data || data.length === 0) return []
  const firstValue = data[0]
  if (firstValue === 0) return data
  return data.map((value) => ((value - firstValue) / firstValue) * 100)
}

function getCorrelationColor(correlation: number): string {
  const absCorr = Math.abs(correlation)
  if (absCorr > 0.7) return correlation > 0 ? '#10b981' : '#ef4444'
  if (absCorr > 0.4) return correlation > 0 ? '#84cc16' : '#f97316'
  if (absCorr > 0.2) return '#eab308'
  return '#94a3b8'
}

function getCorrelationStrength(correlation: number): string {
  const absCorr = Math.abs(correlation)
  if (absCorr > 0.7) return 'Strong'
  if (absCorr > 0.4) return 'Moderate'
  if (absCorr > 0.2) return 'Weak'
  return 'Very Weak'
}

export default function CorrelationAnalysis({ symbols }: CorrelationAnalysisProps) {
  const stockData = symbols.map((symbol) => useStockDaily(symbol, 'compact'))

  const isLoading = stockData.some((d) => d.isLoading)

  const correlationMatrix = useMemo(() => {
    if (symbols.length < 2) return []

    const normalizedPrices: number[][] = []

    stockData.forEach((data) => {
      if (data.data && data.data.length > 0) {
        const prices = data.data.map((d) => d.close)
        normalizedPrices.push(normalizeToPercentage(prices.slice(-30)))
      }
    })

    if (normalizedPrices.length !== symbols.length) return []

    const matrix: Array<{
      symbol1: string
      symbol2: string
      correlation: number
      strength: string
      color: string
    }> = []

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        if (normalizedPrices[i] && normalizedPrices[j]) {
          const minLength = Math.min(normalizedPrices[i].length, normalizedPrices[j].length)
          const corr = calculateCorrelation(
            normalizedPrices[i].slice(0, minLength),
            normalizedPrices[j].slice(0, minLength)
          )
          matrix.push({
            symbol1: symbols[i],
            symbol2: symbols[j],
            correlation: corr,
            strength: getCorrelationStrength(corr),
            color: getCorrelationColor(corr),
          })
        }
      }
    }

    return matrix
  }, [symbols, stockData])

  const scatterData = useMemo(() => {
    if (correlationMatrix.length === 0 || !stockData[0]?.data || !stockData[1]?.data) return []

    const prices1 = stockData[0].data.map((d) => d.close)
    const prices2 = stockData[1].data.map((d) => d.close)
    const minLength = Math.min(prices1.length, prices2.length)

    const normalized1 = normalizeToPercentage(prices1.slice(-minLength))
    const normalized2 = normalizeToPercentage(prices2.slice(-minLength))

    return normalized1.map((val1, index) => ({
      x: val1,
      y: normalized2[index],
    }))
  }, [correlationMatrix, stockData])

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (symbols.length < 2) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            Please select at least 2 symbols for correlation analysis
          </p>
        </Card>
      </SlideUp>
    )
  }

  const averageCorrelation = correlationMatrix.length > 0
    ? correlationMatrix.reduce((sum, m) => sum + m.correlation, 0) / correlationMatrix.length
    : 0

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <IconChartBar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Correlation Analysis
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Correlation analysis reveals the relationship strength between different assets, helping you understand portfolio diversification and identify assets that move together. Strong correlations may indicate shared market factors, while low correlations can signal diversification opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${
              Math.abs(averageCorrelation) > 0.7
                ? 'from-primary-500 to-primary-600'
                : Math.abs(averageCorrelation) > 0.4
                ? 'from-blue-500 to-blue-600'
                : 'from-slate-500 to-slate-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Average Correlation</p>
            <p className="text-3xl font-bold">{averageCorrelation.toFixed(3)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Strong Correlations</p>
            <p className="text-3xl font-bold">
              {correlationMatrix.filter((m) => Math.abs(m.correlation) > 0.7).length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Total Pairs</p>
            <p className="text-3xl font-bold">{correlationMatrix.length}</p>
          </motion.div>
        </div>

        {scatterData.length > 0 && symbols.length >= 2 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Price Correlation Scatter: {symbols[0]} vs {symbols[1]}
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={scatterData}>
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
        )}

        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Correlation Matrix
          </h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Pair
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Correlation
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Strength
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Visualization
                </th>
              </tr>
            </thead>
            <tbody>
              {correlationMatrix.map((item, index) => (
                <tr
                  key={`${item.symbol1}-${item.symbol2}`}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {item.symbol1} / {item.symbol2}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                    {item.correlation.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                      }}
                    >
                      {item.strength}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(item.correlation) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
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

