'use client'

import CryptoChartCard from '@/components/charts/gallery/CryptoChartCard'

export interface CryptoDetailChartProps {
  cryptoId: string
  symbol: string
  name?: string
}

export default function CryptoDetailChart({
  cryptoId,
  symbol,
  name,
}: CryptoDetailChartProps) {
  return (
    <CryptoChartCard
      cryptoId={cryptoId}
      symbol={symbol}
      name={name}
      defaultRange="90d"
    />
  )
}

