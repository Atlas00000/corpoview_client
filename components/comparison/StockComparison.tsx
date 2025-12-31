'use client'

import { useMemo } from 'react'
import { useStockQuote, useStockDaily } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell } from 'recharts'
import { IconTrendingUp, IconTrendingDown } from '@/components/icons'

export interface StockComparisonProps {
  symbols: string[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function normalizeToPercentage(data: any[]): any[] {
  if (!data || data.length === 0) return []
  const firstValue = data[0].close
  if (firstValue === 0) return data
  return data.map((item) => ({
    ...item,
    normalizedPrice: ((item.close - firstValue) / firstValue) * 100,
  }))
}

export default function StockComparison({ symbols }: StockComparisonProps) {
  const stockQuotes = symbols.map((symbol) => useStockQuote(symbol))
  const stockData = symbols.map((symbol) => useStockDaily(symbol, 'compact'))

  const isLoading = stockQuotes.some((q) => q.isLoading) || stockData.some((d) => d.isLoading)

  const comparisonData = useMemo(() => {
    if (!stockData[0]?.data || stockData.length === 0) return []

    const minLength = Math.min(...stockData.map((d) => d.data?.length || 0))
    if (minLength === 0) return []

    const normalizedData: Record<string, number>[] = []

    for (let i = 0; i < minLength; i++) {
      const dataPoint: Record<string, number> = {
        date: formatDate(stockData[0].data![i].date),
      }

      symbols.forEach((symbol, index) => {
        if (stockData[index]?.data?.[i]) {
          const firstPrice = stockData[index].data![0].close
          const currentPrice = stockData[index].data![i].close
          if (firstPrice > 0) {
            dataPoint[symbol] = ((currentPrice - firstPrice) / firstPrice) * 100
          }
        }
      })

      normalizedData.push(dataPoint)
    }

    return normalizedData.slice(-30)
  }, [stockData, symbols])

  const performanceData = useMemo(() => {
    return symbols.map((symbol, index) => {
      const quote = stockQuotes[index].quote
      const dailyData = stockData[index].data || []
      const latestData = dailyData[dailyData.length - 1]
      const previousData = dailyData[dailyData.length - 2]

      if (!quote && !latestData) return null

      const currentPrice = quote?.price || latestData?.close || 0
      const previousPrice = previousData?.close || quote?.previousClose || currentPrice
      const change = currentPrice - previousPrice
      const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0

      return {
        symbol,
        price: currentPrice,
        change,
        changePercent,
        volume: quote?.volume || latestData?.volume || 0,
      }
    }).filter((item): item is NonNullable<typeof item> => item !== null)
  }, [symbols, stockQuotes, stockData])

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
            Stock Comparison: {symbols.join(' vs ')}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Compare stock performance side-by-side with normalized charts, key metrics, and detailed analysis. This comparison helps you evaluate relative performance, identify trends, and make informed investment decisions by understanding how different stocks perform in relation to each other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceData.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-2xl ${
                stock.changePercent >= 0
                  ? 'bg-gradient-to-br from-success-500 to-success-600'
                  : 'bg-gradient-to-br from-danger-500 to-danger-600'
              } text-white shadow-lg`}
            >
              <p className="text-sm font-medium opacity-90 mb-2">{stock.symbol}</p>
              <p className="text-2xl font-bold mb-1">${stock.price.toFixed(2)}</p>
              <div className="flex items-center gap-1">
                {stock.changePercent >= 0 ? (
                  <IconTrendingUp size={18} />
                ) : (
                  <IconTrendingDown size={18} />
                )}
                <p className="text-sm opacity-90">
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Normalized Performance Comparison
            </h4>
            <ResponsiveContainer width="100%" height={350}>
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
                {symbols.map((symbol, index) => (
                  <Line
                    key={symbol}
                    type="monotone"
                    dataKey={symbol}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Performance Ranking
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={performanceData.sort((a, b) => b.changePercent - a.changePercent)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="symbol"
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
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="changePercent" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.changePercent >= 0 ? '#10b981' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Detailed Comparison
          </h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Metric
                </th>
                {performanceData.map((stock) => (
                  <th
                    key={stock.symbol}
                    className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {stock.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Current Price
                </td>
                {performanceData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                    ${stock.price.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Change
                </td>
                {performanceData.map((stock) => (
                  <td
                    key={stock.symbol}
                    className={`py-3 px-4 text-right font-semibold ${
                      stock.changePercent >= 0
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-danger-600 dark:text-danger-400'
                    }`}
                  >
                    {stock.changePercent >= 0 ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Volume
                </td>
                {performanceData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {(stock.volume / 1e6).toFixed(2)}M
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </SlideUp>
  )
}

