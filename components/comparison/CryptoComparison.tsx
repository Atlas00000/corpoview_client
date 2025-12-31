'use client'

import { useMemo } from 'react'
import { useCryptoMarkets, useCryptoHistory } from '@/lib/hooks/useCryptoData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell } from 'recharts'
import { IconTrendingUp, IconTrendingDown } from '@/components/icons'

export interface CryptoComparisonProps {
  cryptoIds: string[]
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

function normalizeToPercentage(data: number[]): number[] {
  if (!data || data.length === 0) return []
  const firstValue = data[0]
  if (firstValue === 0) return data
  return data.map((value) => ((value - firstValue) / firstValue) * 100)
}

export default function CryptoComparison({ cryptoIds }: CryptoComparisonProps) {
  const { markets, isLoading: marketsLoading } = useCryptoMarkets('usd', cryptoIds, cryptoIds.length)
  const cryptoHistories = cryptoIds.map((id) => useCryptoHistory(id, 'usd', 30))

  const isLoading = marketsLoading || cryptoHistories.some((h) => h.isLoading)

  const performanceData = useMemo(() => {
    if (!markets) return []

    return cryptoIds.map((id) => {
      const market = markets.find((m) => m.id === id)
      if (!market) return null
      return {
        id,
        name: market.name,
        symbol: market.symbol.toUpperCase(),
        price: market.currentPrice,
        marketCap: market.marketCap,
        volume: market.totalVolume,
        change24h: market.priceChangePercentage24h,
      }
    }).filter((item): item is NonNullable<typeof item> => item !== null)
  }, [markets, cryptoIds])

  const comparisonData = useMemo(() => {
    if (!cryptoHistories[0]?.history || cryptoHistories.length === 0) return []

    const minLength = Math.min(...cryptoHistories.map((h) => h.history?.length || 0))
    if (minLength === 0) return []

    const normalizedData: Record<string, number | string>[] = []

    cryptoHistories.forEach((history, index) => {
      if (history.history && history.history.length > 0) {
        const prices = history.history.map((h: any) => h.price || 0).filter((p: number) => p > 0)
        if (prices.length === 0) return

        const normalized = normalizeToPercentage(prices.slice(-minLength))
        const dates = history.history.slice(-minLength).map((h: any) => {
          if (typeof h === 'object' && h.date) return new Date(h.date).getTime()
          return Date.now()
        })

        normalized.forEach((value, i) => {
          if (!normalizedData[i]) {
            normalizedData[i] = {
              date: formatDate(dates[i] || Date.now()),
            }
          }
          const crypto = performanceData.find((c) => c.id === cryptoIds[index])
          if (crypto) {
            normalizedData[i][crypto.symbol] = value
          }
        })
      }
    })

    return normalizedData.slice(-30)
  }, [cryptoHistories, cryptoIds, performanceData])

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
            Cryptocurrency Comparison: {performanceData.map((c) => c.symbol).join(' vs ')}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Analyze cryptocurrency performance across different digital assets. Compare price movements, market capitalization, trading volume, and 24-hour changes to understand relative strength and identify opportunities in the crypto market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceData.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-2xl ${
                crypto.change24h >= 0
                  ? 'bg-gradient-to-br from-success-500 to-success-600'
                  : 'bg-gradient-to-br from-danger-500 to-danger-600'
              } text-white shadow-lg`}
            >
              <p className="text-sm font-medium opacity-90 mb-1">{crypto.symbol}</p>
              <p className="text-xs opacity-80 mb-2">{crypto.name}</p>
              <p className="text-2xl font-bold mb-1">${crypto.price.toFixed(2)}</p>
              <div className="flex items-center gap-1">
                {crypto.change24h >= 0 ? (
                  <IconTrendingUp size={18} />
                ) : (
                  <IconTrendingDown size={18} />
                )}
                <p className="text-sm opacity-90">
                  {crypto.change24h >= 0 ? '+' : ''}
                  {crypto.change24h.toFixed(2)}%
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
                {cryptoIds.map((id, index) => {
                  const crypto = performanceData.find((c) => c.id === id)
                  return (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={crypto?.symbol || id}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              24h Change Ranking
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[...performanceData].sort((a, b) => b.change24h - a.change24h)}>
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
                  formatter={(value: number) => [`${value.toFixed(2)}%`, '24h Change']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="change24h" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.change24h >= 0 ? '#10b981' : '#f43f5e'}
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
                {performanceData.map((crypto) => (
                  <th
                    key={crypto.id}
                    className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {crypto.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Current Price
                </td>
                {performanceData.map((crypto) => (
                  <td key={crypto.id} className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                    ${crypto.price.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  24h Change
                </td>
                {performanceData.map((crypto) => (
                  <td
                    key={crypto.id}
                    className={`py-3 px-4 text-right font-semibold ${
                      crypto.change24h >= 0
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-danger-600 dark:text-danger-400'
                    }`}
                  >
                    {crypto.change24h >= 0 ? '+' : ''}
                    {crypto.change24h.toFixed(2)}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  Market Cap
                </td>
                {performanceData.map((crypto) => (
                  <td key={crypto.id} className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {formatLargeNumber(crypto.marketCap)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  24h Volume
                </td>
                {performanceData.map((crypto) => (
                  <td key={crypto.id} className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {formatLargeNumber(crypto.volume)}
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

