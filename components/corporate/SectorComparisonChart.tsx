'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useSWR from 'swr'
import apiClient from '@/lib/api/client'

export interface SectorComparisonChartProps {
  symbols: string[]
  sectorName?: string
}

const SECTOR_SAMPLES: Record<string, string[]> = {
  Technology: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'],
  Financial: ['JPM', 'BAC', 'GS', 'WFC', 'C'],
  Healthcare: ['JNJ', 'PFE', 'UNH', 'ABBV', 'TMO'],
  Consumer: ['AMZN', 'TSLA', 'HD', 'NKE', 'SBUX'],
  Energy: ['XOM', 'CVX', 'COP', 'SLB', 'EOG'],
}

export default function SectorComparisonChart({
  symbols,
  sectorName,
}: SectorComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'change' | 'volume'>('price')
  
  const { data: quotesData, isLoading } = useSWR(
    symbols.length > 0 ? `sector-quotes-${symbols.join('-')}` : null,
    async () => {
      const quotes = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await apiClient.get(`/api/stocks/quote/${symbol}`)
            return { symbol, quote: response.data }
          } catch {
            return { symbol, quote: null }
          }
        })
      )
      return quotes
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  const quotes = quotesData || []

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={400} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  const chartData = quotes
    .map((q) => ({
      symbol: q.symbol,
      price: q.quote?.price || 0,
      change: q.quote?.changePercent || 0,
      volume: q.quote?.volume || 0,
    }))
    .filter((item) => item.price > 0)

  const metrics = [
    { id: 'price' as const, label: 'Price', unit: '$' },
    { id: 'change' as const, label: 'Change %', unit: '%' },
    { id: 'volume' as const, label: 'Volume', unit: '' },
  ]

  const formatValue = (value: number, metric: string) => {
    if (metric === 'volume') {
      if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
      if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
      return value.toLocaleString()
    }
    if (metric === 'change') {
      return `${value.toFixed(2)}%`
    }
    return `$${value.toFixed(2)}`
  }

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {sectorName ? `${sectorName} Sector Comparison` : 'Sector Comparison'}
          </h3>
          <div className="flex gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedMetric === metric.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="symbol"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => {
                    if (selectedMetric === 'volume') {
                      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
                      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
                      return `${(value / 1e3).toFixed(0)}K`
                    }
                    if (selectedMetric === 'change') {
                      return `${value.toFixed(1)}%`
                    }
                    return `$${value.toFixed(0)}`
                  }}
                />
                <Tooltip
                  formatter={(value: number) => formatValue(value, selectedMetric)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey={selectedMetric}
                  fill={
                    selectedMetric === 'change'
                      ? chartData.some((d) => d.change < 0)
                        ? '#f43f5e'
                        : '#10b981'
                      : '#3b82f6'
                  }
                  name={metrics.find((m) => m.id === selectedMetric)?.label}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-center"
                >
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {item.symbol}
                  </p>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {formatValue(item[selectedMetric], selectedMetric)}
                  </p>
                  {selectedMetric === 'price' && item.change !== 0 && (
                    <p
                      className={`text-xs mt-1 ${
                        item.change >= 0
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-danger-600 dark:text-danger-400'
                      }`}
                    >
                      {item.change >= 0 ? '+' : ''}
                      {item.change.toFixed(2)}%
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No data available for comparison
            </p>
          </div>
        )}
      </Card>
    </SlideUp>
  )
}

