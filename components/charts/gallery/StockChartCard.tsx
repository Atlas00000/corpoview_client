'use client'

import { useState, lazy, Suspense } from 'react'
import { useStockDaily, useStockIntraday } from '@/lib/hooks/useStockData'
import ChartDateRangeSelector, { TimeRange } from '../ChartDateRangeSelector'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'

// Lazy load heavy chart components
const LineChart = lazy(() => import('../d3/LineChart'))
const CandlestickChart = lazy(() => import('../d3/CandlestickChart'))

export interface StockChartCardProps {
  symbol: string
  name?: string
  chartType?: 'line' | 'candlestick'
  defaultRange?: TimeRange
}

function getOutputSize(range: TimeRange): 'compact' | 'full' {
  if (range === '7d' || range === '30d') return 'compact'
  return 'full'
}

export default function StockChartCard({
  symbol,
  name,
  chartType = 'line',
  defaultRange = '30d',
}: StockChartCardProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange)
  const outputsize = getOutputSize(range)
  
  const { data: dailyData, isLoading: isLoadingDaily } = useStockDaily(symbol, outputsize)
  const { data: intradayData, isLoading: isLoadingIntraday } = useStockIntraday(
    symbol,
    range === '7d' ? '5min' : '60min'
  )

  const isLoading = isLoadingDaily || isLoadingIntraday

  const chartData = range === '7d' && intradayData ? intradayData : dailyData

  const lineChartData =
    chartData?.map((point) => ({
      date: point.date,
      value: point.close,
    })) || []

  const candlestickChartData =
    chartData?.map((point) => ({
      date: point.date,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: point.volume,
    })) || []

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6 overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {symbol}
              </h3>
              {name && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{name}</p>
              )}
            </div>
            <ChartDateRangeSelector
              selectedRange={range}
              onRangeChange={setRange}
              options={['7d', '30d', '90d', '1y']}
            />
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <Skeleton height={400} className="rounded-xl" />
          ) : (
            <Suspense
              fallback={
                <div className="h-[400px] flex items-center justify-center">
                  <Skeleton height={400} className="rounded-xl" />
                </div>
              }
            >
              {chartType === 'line' ? (
                <LineChart
                  data={lineChartData}
                  height={400}
                  color="#2563eb"
                  enableZoom={true}
                  enableTooltip={true}
                  enableBrush={true}
                  className="w-full"
                />
              ) : (
                <CandlestickChart
                  data={candlestickChartData}
                  height={400}
                  enableTooltip={true}
                  className="w-full"
                />
              )}
            </Suspense>
          )}
        </div>
      </Card>
    </SlideUp>
  )
}

