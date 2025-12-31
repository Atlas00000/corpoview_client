'use client'

import { useCryptoPrice } from '@/lib/hooks/useCryptoData'
import Image from 'next/image'

interface CryptoHeaderProps {
  coinId: string
  coinName?: string
  coinSymbol?: string
  coinImage?: string
  className?: string
}

export default function CryptoHeader({
  coinId,
  coinName,
  coinSymbol,
  coinImage,
  className = '',
}: CryptoHeaderProps) {
  const { prices, isLoading } = useCryptoPrice(coinId)

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    )
  }

  if (!prices || !prices[coinId]) {
    return (
      <div className={`text-red-600 dark:text-red-400 ${className}`}>
        Failed to load cryptocurrency data
      </div>
    )
  }

  const priceData = prices[coinId]
  const currentPrice = priceData.usd || 0
  const change24h = priceData.usd_24h_change || 0
  const isPositive = change24h >= 0
  const changeColor = isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {coinImage && (
            <Image
              src={coinImage}
              alt={coinName || coinSymbol || coinId}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {coinName || coinSymbol?.toUpperCase() || coinId}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {coinSymbol?.toUpperCase() || coinId}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
          </div>
          <div className={`text-lg font-medium ${changeColor}`}>
            {isPositive ? '+' : ''}
            {change24h.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">24h</div>
        </div>
      </div>
    </div>
  )
}

