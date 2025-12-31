'use client'

import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'

interface MarketDataProps {
  coinId: string
  className?: string
}

export default function MarketData({ coinId, className = '' }: MarketDataProps) {
  const { markets, isLoading } = useCryptoMarkets('usd', [coinId], 1)

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!markets || markets.length === 0) {
    return (
      <div className={`text-red-600 dark:text-red-400 ${className}`}>
        Failed to load market data
      </div>
    )
  }

  const market = markets[0]

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Market Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatMarketCap(market.marketCap)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Rank #{market.marketCapRank}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h Volume</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatMarketCap(market.totalVolume)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h High</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${market.high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h Low</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${market.low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </p>
          </div>
        </div>

        {market.circulatingSupply && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Circulating Supply</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {market.circulatingSupply.toLocaleString()} {market.symbol.toUpperCase()}
                </p>
              </div>

              {market.totalSupply && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Supply</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {market.totalSupply.toLocaleString()} {market.symbol.toUpperCase()}
                  </p>
                </div>
              )}

              {market.maxSupply && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Supply</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {market.maxSupply.toLocaleString()} {market.symbol.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

