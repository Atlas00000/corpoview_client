'use client'

import { useMemo } from 'react'
import { useStockQuote } from '@/lib/hooks/useStockData'
import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import { useLatestRates } from '@/lib/hooks/useFXData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { IconChartPie, IconTrendingUp, IconTrendingDown } from '@/components/icons'

export interface PortfolioAsset {
  type: 'stock' | 'crypto' | 'fx'
  symbol: string
  quantity: number
  purchasePrice?: number
}

export interface PortfolioViewProps {
  assets: PortfolioAsset[]
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toLocaleString()}`
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6']

export default function PortfolioView({ assets }: PortfolioViewProps) {
  const stockSymbols = assets.filter((a) => a.type === 'stock').map((a) => a.symbol)
  const cryptoIds = assets.filter((a) => a.type === 'crypto').map((a) => a.symbol.toLowerCase())
  const fxPairs = assets.filter((a) => a.type === 'fx').map((a) => a.symbol)

  const stockQuotes = stockSymbols.map((symbol) => useStockQuote(symbol))
  const { markets: cryptoMarkets } = useCryptoMarkets('usd', cryptoIds.length > 0 ? cryptoIds : undefined, cryptoIds.length)
  const { rates } = useLatestRates('USD')

  const isLoading = stockQuotes.some((q) => q.isLoading)

  const portfolioData = useMemo(() => {
    const data: Array<{
      symbol: string
      type: string
      quantity: number
      currentPrice: number
      value: number
      change?: number
      changePercent?: number
    }> = []

    assets.forEach((asset) => {
      if (asset.type === 'stock') {
        const index = stockSymbols.indexOf(asset.symbol)
        const quote = stockQuotes[index]?.quote
        if (quote) {
          const currentPrice = quote.price
          const value = currentPrice * asset.quantity
          data.push({
            symbol: asset.symbol,
            type: 'Stock',
            quantity: asset.quantity,
            currentPrice,
            value,
            change: quote.change,
            changePercent: quote.changePercent,
          })
        }
      } else if (asset.type === 'crypto') {
        const market = cryptoMarkets?.find((m) => m.id === asset.symbol.toLowerCase())
        if (market) {
          const currentPrice = market.currentPrice
          const value = currentPrice * asset.quantity
          data.push({
            symbol: asset.symbol.toUpperCase(),
            type: 'Crypto',
            quantity: asset.quantity,
            currentPrice,
            value,
            change: market.priceChange24h,
            changePercent: market.priceChangePercentage24h,
          })
        }
      } else if (asset.type === 'fx') {
        const [from, to] = asset.symbol.split('/')
        if (rates?.rates && rates.rates[to]) {
          const currentPrice = rates.rates[to]
          const value = currentPrice * asset.quantity
          data.push({
            symbol: asset.symbol,
            type: 'FX',
            quantity: asset.quantity,
            currentPrice,
            value,
          })
        }
      }
    })

    return data
  }, [assets, stockQuotes, cryptoMarkets, rates, stockSymbols])

  const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0)
  const totalChange = portfolioData.reduce((sum, asset) => sum + (asset.change || 0) * asset.quantity, 0)
  const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

  const pieData = portfolioData.map((asset, index) => ({
    name: asset.symbol,
    value: asset.value,
    color: COLORS[index % COLORS.length],
  }))

  const typeDistribution = portfolioData.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + asset.value
    return acc
  }, {} as Record<string, number>)

  const typeChartData = Object.entries(typeDistribution).map(([type, value]) => ({
    type,
    value,
    percentage: (value / totalValue) * 100,
  }))

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={600} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (portfolioData.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">
            No portfolio data available
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
            <IconChartPie className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Portfolio View
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Comprehensive portfolio analysis across all your holdings. View total portfolio value, asset allocation, performance metrics, and understand how different asset types contribute to your overall portfolio returns. This holistic view helps you optimize diversification and track portfolio health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Total Portfolio Value</p>
            <p className="text-3xl font-bold">{formatLargeNumber(totalValue)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-5 rounded-2xl ${
              totalChangePercent >= 0
                ? 'bg-gradient-to-br from-success-500 to-success-600'
                : 'bg-gradient-to-br from-danger-500 to-danger-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Total Change</p>
            <div className="flex items-center gap-2">
              {totalChangePercent >= 0 ? (
                <IconTrendingUp size={24} />
              ) : (
                <IconTrendingDown size={24} />
              )}
              <p className="text-2xl font-bold">
                {totalChangePercent >= 0 ? '+' : ''}
                {totalChangePercent.toFixed(2)}%
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Total Assets</p>
            <p className="text-3xl font-bold">{portfolioData.length}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Portfolio Allocation
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatLargeNumber(value)}
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
              Asset Type Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="type"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => formatLargeNumber(value)}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'value' ? formatLargeNumber(value) : `${value.toFixed(1)}%`,
                    name === 'value' ? 'Value' : 'Percentage',
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Portfolio Holdings
          </h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Asset
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Type
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Quantity
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Current Price
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Total Value
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Change
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Allocation
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((asset, index) => (
                <tr
                  key={`${asset.symbol}-${index}`}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {asset.symbol}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {asset.type}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {asset.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    ${asset.currentPrice.toFixed(asset.type === 'FX' ? 4 : 2)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                    {formatLargeNumber(asset.value)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      asset.changePercent !== undefined
                        ? asset.changePercent >= 0
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-danger-600 dark:text-danger-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {asset.changePercent !== undefined
                      ? `${asset.changePercent >= 0 ? '+' : ''}${asset.changePercent.toFixed(2)}%`
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    {((asset.value / totalValue) * 100).toFixed(1)}%
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

