'use client'

import { useMemo } from 'react'
import { useStockDaily, useStockQuote } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts'
import { IconChartBar } from '@/components/icons'

export interface VolumeAnalysisProps {
  symbol: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(2)}K`
  return value.toLocaleString()
}

export default function VolumeAnalysis({ symbol }: VolumeAnalysisProps) {
  const { data: priceData, isLoading } = useStockDaily(symbol, 'compact')
  const { quote } = useStockQuote(symbol)

  const volumeMetrics = useMemo(() => {
    if (!priceData || priceData.length === 0) {
      return {
        avgVolume: 0,
        maxVolume: 0,
        minVolume: 0,
        totalVolume: 0,
        volumeTrend: 0,
      }
    }

    const volumes = priceData.map((d) => d.volume)
    const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length
    const maxVolume = Math.max(...volumes)
    const minVolume = Math.min(...volumes)
    const totalVolume = volumes.reduce((sum, v) => sum + v, 0)

    const recentVolumes = volumes.slice(-10)
    const earlierVolumes = volumes.slice(0, -10)
    const recentAvg = recentVolumes.reduce((sum, v) => sum + v, 0) / recentVolumes.length
    const earlierAvg = earlierVolumes.length > 0
      ? earlierVolumes.reduce((sum, v) => sum + v, 0) / earlierVolumes.length
      : recentAvg
    const volumeTrend = earlierAvg > 0 ? ((recentAvg - earlierAvg) / earlierAvg) * 100 : 0

    return {
      avgVolume,
      maxVolume,
      minVolume,
      totalVolume,
      volumeTrend,
    }
  }, [priceData])

  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) return []

    return priceData.slice(-30).map((item) => ({
      date: formatDate(item.date),
      volume: item.volume,
      close: item.close,
      high: item.high,
      low: item.low,
      priceChange: item.close - item.open,
    }))
  }, [priceData])

  const volumeDistribution = useMemo(() => {
    if (!chartData.length) return []

    const ranges = [
      { label: 'Low', min: 0, max: volumeMetrics.avgVolume * 0.5, count: 0 },
      { label: 'Medium', min: volumeMetrics.avgVolume * 0.5, max: volumeMetrics.avgVolume * 1.5, count: 0 },
      { label: 'High', min: volumeMetrics.avgVolume * 1.5, max: volumeMetrics.maxVolume, count: 0 },
    ]

    chartData.forEach((item) => {
      if (item.volume < ranges[0].max) ranges[0].count++
      else if (item.volume < ranges[1].max) ranges[1].count++
      else ranges[2].count++
    })

    return ranges
  }, [chartData, volumeMetrics])

  const currentVolume = quote?.volume || chartData[chartData.length - 1]?.volume || 0
  const volumeRatio = volumeMetrics.avgVolume > 0 ? (currentVolume / volumeMetrics.avgVolume) * 100 : 0

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
            No volume data available for {symbol}
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
            <IconChartBar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Volume Analysis: {symbol}
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Volume analysis examines trading activity to validate price movements and identify market sentiment. High volume during price increases suggests strong buyer interest, while high volume during declines may indicate selling pressure. Understanding volume patterns helps confirm trend strength and identify potential reversals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Current Volume</p>
            <p className="text-2xl font-bold">{formatLargeNumber(currentVolume)}</p>
            <p className="text-xs opacity-80 mt-1">
              {volumeRatio >= 100 ? '+' : ''}
              {(volumeRatio - 100).toFixed(0)}% vs avg
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Average Volume</p>
            <p className="text-2xl font-bold">{formatLargeNumber(volumeMetrics.avgVolume)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Max Volume</p>
            <p className="text-2xl font-bold">{formatLargeNumber(volumeMetrics.maxVolume)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Min Volume</p>
            <p className="text-2xl font-bold">{formatLargeNumber(volumeMetrics.minVolume)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`p-5 rounded-2xl ${
              volumeMetrics.volumeTrend >= 0
                ? 'bg-gradient-to-br from-success-500 to-success-600'
                : 'bg-gradient-to-br from-danger-500 to-danger-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Volume Trend</p>
            <p className="text-2xl font-bold">
              {volumeMetrics.volumeTrend >= 0 ? '+' : ''}
              {volumeMetrics.volumeTrend.toFixed(1)}%
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Volume Trend (30 Days)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                  yAxisId="volume"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => formatLargeNumber(value)}
                />
                <Tooltip
                  formatter={(value: number) => [formatLargeNumber(value), 'Volume']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Volume Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip
                  formatter={(value: number) => [value, 'Days']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {volumeDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#94a3b8' : index === 1 ? '#3b82f6' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Volume vs Price Movement
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                yAxisId="volume"
                orientation="left"
                stroke="#64748b"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#64748b' }}
                tickFormatter={(value) => formatLargeNumber(value)}
              />
              <YAxis
                yAxisId="price"
                orientation="right"
                stroke="#64748b"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#64748b' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'volume' ? formatLargeNumber(value) : `$${value.toFixed(2)}`,
                  name === 'volume' ? 'Volume' : 'Close Price',
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar yAxisId="volume" dataKey="volume" fill="#3b82f6" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </SlideUp>
  )
}

