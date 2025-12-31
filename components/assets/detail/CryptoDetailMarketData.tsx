'use client'

import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'

export interface CryptoDetailMarketDataProps {
  cryptoId: string
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function CryptoDetailMarketData({ cryptoId }: CryptoDetailMarketDataProps) {
  const { markets, isLoading } = useCryptoMarkets('usd', [cryptoId], 1)

  if (isLoading) {
    return (
      <SlideUp>
        <Skeleton height={300} className="rounded-2xl" />
      </SlideUp>
    )
  }

  if (!markets || markets.length === 0) return null

  const market = markets[0]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Market Statistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Market Cap
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatLargeNumber(market.marketCap)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Rank #{market.marketCapRank}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              24h Volume
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatLargeNumber(market.totalVolume)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              24h Range
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              ${market.low24h.toFixed(2)} - ${market.high24h.toFixed(2)}
            </p>
          </div>
        </div>

        {market.circulatingSupply && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
              Supply Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Circulating Supply
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {market.circulatingSupply.toLocaleString()} {market.symbol.toUpperCase()}
                </span>
              </div>

              {market.totalSupply && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Supply
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {market.totalSupply.toLocaleString()} {market.symbol.toUpperCase()}
                  </span>
                </div>
              )}

              {market.maxSupply && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Max Supply
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {market.maxSupply.toLocaleString()} {market.symbol.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </SlideUp>
  )
}

