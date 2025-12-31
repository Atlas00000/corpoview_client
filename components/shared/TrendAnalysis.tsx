'use client'

import { useMemo } from 'react'
import { analyzeTrend, generateNarrative, TrendDataPoint } from '@/lib/utils/trendAnalysis'
import DataNarrative from './DataNarrative'

export interface TrendAnalysisProps {
  data: TrendDataPoint[]
  assetName?: string
  className?: string
}

export default function TrendAnalysis({
  data,
  assetName,
  className = '',
}: TrendAnalysisProps) {
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null
    return analyzeTrend(data)
  }, [data])

  if (!analysis) {
    return (
      <div className={className}>
        <p className="text-gray-500 dark:text-gray-400">No trend data available</p>
      </div>
    )
  }

  const narrative = generateNarrative(analysis, assetName)

  return (
    <div className={className}>
      <DataNarrative
        title="Trend Analysis"
        content={
          <div className="whitespace-pre-line">
            {narrative.split('**').map((part, index) => {
              if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>
              }
              return <span key={index}>{part}</span>
            })}
          </div>
        }
        insights={analysis.insights}
      />
    </div>
  )
}

