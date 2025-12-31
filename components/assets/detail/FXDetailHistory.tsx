'use client'

import FXChartCard from '@/components/charts/gallery/FXChartCard'

export interface FXDetailHistoryProps {
  from: string
  to: string
}

export default function FXDetailHistory({ from, to }: FXDetailHistoryProps) {
  return (
    <FXChartCard from={from} to={to} defaultRange="30d" />
  )
}

