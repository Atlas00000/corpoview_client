'use client'

import { useMemo } from 'react'
import { useStockDaily, useStockQuote } from '@/lib/hooks/useStockData'
import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { IconChartBar, IconTrendingUp, IconTrendingDown, IconActivity } from '@/components/icons'

export interface MarketInsightsSummaryProps {
  symbols?: string[]
}

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function MarketInsightsSummary({ symbols = DEFAULT_SYMBOLS }: MarketInsightsSummaryProps) {
  const stockQuotes = symbols.map((symbol) => useStockQuote(symbol))
  const stockData = symbols.map((symbol) => useStockDaily(symbol, 'compact'))

  const { markets: cryptoMarkets } = useCryptoMarkets('usd', ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana'], 5)

  const isLoading = stockQuotes.some((q) => q.isLoading) || stockData.some((d) => d.isLoading)

  const marketPerformance = useMemo(() => {
    const performance = symbols.map((symbol, index) => {
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

    return performance
  }, [symbols, stockQuotes, stockData])

  const gainers = marketPerformance.filter((item) => item.changePercent > 0).length
  const losers = marketPerformance.filter((item) => item.changePercent < 0).length
  const neutral = marketPerformance.length - gainers - losers

  const totalVolume = marketPerformance.reduce((sum, item) => sum + item.volume, 0)
  const averageChange = marketPerformance.reduce((sum, item) => sum + item.changePercent, 0) / marketPerformance.length

  const marketDistribution = [
    { name: 'Gainers', value: gainers, color: '#10b981' },
    { name: 'Losers', value: losers, color: '#f43f5e' },
    { name: 'Neutral', value: neutral, color: '#64748b' },
  ]

  const performanceChartData = marketPerformance
    .sort((a, b) => b.changePercent - a.changePercent)
    .map((item) => ({
      symbol: item.symbol,
      changePercent: item.changePercent,
      volume: item.volume,
    }))

  const cryptoMarketCap = cryptoMarkets?.reduce((sum, market) => sum + market.marketCap, 0) || 0
  const crypto24hChange = cryptoMarkets?.reduce((sum, market) => sum + market.priceChangePercentage24h, 0) / (cryptoMarkets?.length || 1) || 0

  if (isLoading) {
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
            <IconChartBar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Market Insights Summary
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Get a comprehensive overview of market conditions across stocks and cryptocurrencies. This summary provides key metrics including average performance, total volume, market capitalization, and overall market sentiment to help you understand the broader market context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl ${
              averageChange >= 0
                ? 'bg-gradient-to-br from-success-500 to-success-600'
                : 'bg-gradient-to-br from-danger-500 to-danger-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Average Change</p>
            <div className="flex items-center gap-2">
              {averageChange >= 0 ? (
                <IconTrendingUp size={24} />
              ) : (
                <IconTrendingDown size={24} />
              )}
              <p className="text-2xl font-bold">
                {averageChange >= 0 ? '+' : ''}
                {averageChange.toFixed(2)}%
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Total Volume</p>
            <p className="text-2xl font-bold">{formatLargeNumber(totalVolume)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Crypto Market Cap</p>
            <p className="text-2xl font-bold">{formatLargeNumber(cryptoMarketCap)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`p-5 rounded-2xl ${
              crypto24hChange >= 0
                ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                : 'bg-gradient-to-br from-rose-500 to-rose-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Crypto 24h Change</p>
            <div className="flex items-center gap-2">
              {crypto24hChange >= 0 ? (
                <IconTrendingUp size={24} />
              ) : (
                <IconTrendingDown size={24} />
              )}
              <p className="text-2xl font-bold">
                {crypto24hChange >= 0 ? '+' : ''}
                {crypto24hChange.toFixed(2)}%
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Market Performance Distribution
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={marketDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Stock Performance Ranking
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="symbol"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
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
                  {performanceChartData.map((entry, index) => (
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
        >
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Market Insights
          </h4>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              Market analysis shows {gainers > losers ? 'a positive bias' : losers > gainers ? 'a negative bias' : 'balanced conditions'} with {gainers} advancing stocks and {losers} declining stocks. The average performance across tracked assets is {averageChange >= 0 ? 'positive' : 'negative'} at {averageChange.toFixed(2)}%, indicating {averageChange >= 1 ? 'strong' : averageChange >= 0 ? 'moderate' : 'weak'} market sentiment.
            </p>
            {cryptoMarkets && cryptoMarkets.length > 0 && (
              <p>
                Cryptocurrency markets show {crypto24hChange >= 0 ? 'positive' : 'negative'} momentum with an average 24-hour change of {crypto24hChange.toFixed(2)}%. The combined market capitalization stands at {formatLargeNumber(cryptoMarketCap)}, reflecting {cryptoMarketCap >= 1e12 ? 'strong' : 'moderate'} market activity.
              </p>
            )}
          </div>
        </motion.div>
      </Card>
    </SlideUp>
  )
}

