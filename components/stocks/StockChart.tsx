'use client'

import { useState, useRef } from 'react'
import { useStockDaily, useStockIntraday } from '@/lib/hooks/useStockData'
import LineChart from '../charts/d3/LineChart'
import CandlestickChart from '../charts/d3/CandlestickChart'
import ExportButton from '../shared/ExportButton'

interface StockChartProps {
  symbol: string
  chartType?: 'line' | 'candlestick'
  timeframe?: 'intraday' | 'daily'
  className?: string
}

export default function StockChart({
  symbol,
  chartType = 'line',
  timeframe = 'daily',
  className = '',
}: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)

  const { data: intradayData, isLoading: intradayLoading } = useStockIntraday(
    selectedTimeframe === 'intraday' ? symbol : null,
    '5min'
  )
  const { data: dailyData, isLoading: dailyLoading } = useStockDaily(
    selectedTimeframe === 'daily' ? symbol : null
  )

  const isLoading = selectedTimeframe === 'intraday' ? intradayLoading : dailyLoading
  const chartData = selectedTimeframe === 'intraday' ? intradayData : dailyData

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96 ${className}`}>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading chart data...</p>
        </div>
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    )
  }

  // Transform data for LineChart (if using line chart type)
  const lineChartData =
    chartType === 'line'
      ? chartData.map((point) => ({
          date: point.date,
          value: point.close,
        }))
      : []

  return (
    <div ref={containerRef} className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTimeframe('intraday')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === 'intraday'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Intraday
          </button>
          <button
            onClick={() => setSelectedTimeframe('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Daily
          </button>
        </div>
        <ExportButton
          containerRef={containerRef}
          data={chartData}
          chartTitle={`${symbol}-${selectedTimeframe}`}
          showPNG={true}
          showSVG={true}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        {chartType === 'line' && lineChartData.length > 0 ? (
          <LineChart
            data={lineChartData}
            height={400}
            enableZoom={true}
            enableTooltip={true}
            color="#3b82f6"
          />
        ) : chartType === 'candlestick' ? (
          <CandlestickChart data={chartData} height={400} enableTooltip={true} />
        ) : null}
      </div>
    </div>
  )
}

