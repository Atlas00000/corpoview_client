'use client'

import { useState, useMemo } from 'react'
import { useCryptoHistory } from '@/lib/hooks/useCryptoData'
import LineChart from '../d3/LineChart'
import ChartDateRangeSelector, { TimeRange } from '../ChartDateRangeSelector'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'

export interface CryptoChartCardProps {
  cryptoId: string
  symbol: string
  name?: string
  defaultRange?: TimeRange
}

function getDaysFromRange(range: TimeRange): number {
  switch (range) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '1y':
      return 365
    default:
      return 30
  }
}

export default function CryptoChartCard({
  cryptoId,
  symbol,
  name,
  defaultRange = '30d',
}: CryptoChartCardProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange)
  const days = getDaysFromRange(range)
  
  const { history, isLoading } = useCryptoHistory(cryptoId, 'usd', days)

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return []
    return history.map((point) => ({
      date: point.date,
      value: point.price,
    }))
  }, [history])

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6 overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {symbol.toUpperCase()}
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
            <LineChart
              data={chartData}
              height={400}
              color="#6366f1"
              enableZoom={true}
              enableTooltip={true}
              enableBrush={true}
              className="w-full"
            />
          )}
        </div>
      </Card>
    </SlideUp>
  )
}

