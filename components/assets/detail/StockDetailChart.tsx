'use client'

import { useState } from 'react'
import { useStockDaily } from '@/lib/hooks/useStockData'
import StockChartCard from '@/components/charts/gallery/StockChartCard'

export interface StockDetailChartProps {
  symbol: string
  name?: string
}

export default function StockDetailChart({ symbol, name }: StockDetailChartProps) {
  return (
    <StockChartCard
      symbol={symbol}
      name={name}
      chartType="line"
      defaultRange="90d"
    />
  )
}

