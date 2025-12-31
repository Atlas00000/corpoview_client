'use client'

import { useRef } from 'react'
import { useCryptoHistory } from '@/lib/hooks/useCryptoData'
import LineChart from '../charts/d3/LineChart'
import ExportButton from '../shared/ExportButton'

interface CryptoChartProps {
  coinId: string
  vsCurrency?: string
  days?: number
  className?: string
}

export default function CryptoChart({
  coinId,
  vsCurrency = 'usd',
  days = 30,
  className = '',
}: CryptoChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { history, isLoading } = useCryptoHistory(coinId, vsCurrency, days)

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96 ${className}`}>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading chart data...</p>
        </div>
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    )
  }

  // Transform data for LineChart
  const chartData = history.map((point) => ({
    date: point.date,
    value: point.price,
  }))

  return (
    <div ref={containerRef} className={className}>
      <div className="flex items-center justify-end mb-4">
        <ExportButton
          containerRef={containerRef}
          data={history}
          chartTitle={`${coinId}-${vsCurrency}-${days}d`}
          showPNG={true}
          showSVG={true}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <LineChart
          data={chartData}
          height={400}
          enableZoom={true}
          enableTooltip={true}
          color="#f59e0b"
        />
      </div>
    </div>
  )
}

