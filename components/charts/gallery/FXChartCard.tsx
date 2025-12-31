'use client'

import { useState } from 'react'
import { useLatestRates } from '@/lib/hooks/useFXData'
import LineChart from '../d3/LineChart'
import ChartDateRangeSelector, { TimeRange } from '../ChartDateRangeSelector'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'

export interface FXChartCardProps {
  from: string
  to: string
  defaultRange?: TimeRange
}

export default function FXChartCard({
  from,
  to,
  defaultRange = '30d',
}: FXChartCardProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange)
  const { rates, isLoading } = useLatestRates(from)

  const chartData = rates
    ? [
        {
          date: new Date().toISOString(),
          value: rates.rates[to] || 0,
        },
      ]
    : []

  const rate = rates?.rates[to]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6 overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {from}/{to}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Exchange Rate
              </p>
            </div>
            <ChartDateRangeSelector
              selectedRange={range}
              onRangeChange={setRange}
              options={['30d', '90d']}
            />
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <Skeleton height={400} className="rounded-xl" />
          ) : rate ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {rate.toFixed(to === 'JPY' ? 2 : 4)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Historical data coming soon
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-slate-500">
              Rate not available
            </div>
          )}
        </div>
      </Card>
    </SlideUp>
  )
}

