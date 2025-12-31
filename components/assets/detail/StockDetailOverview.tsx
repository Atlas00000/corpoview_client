'use client'

import { useCompanyOverview, useCompanyProfile } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'

export interface StockDetailOverviewProps {
  symbol: string
}

function formatLargeNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'N/A'
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString()}`
}

export default function StockDetailOverview({ symbol }: StockDetailOverviewProps) {
  const { overview, isLoading: overviewLoading } = useCompanyOverview(symbol)
  const { profile, isLoading: profileLoading } = useCompanyProfile(symbol)

  if (overviewLoading || profileLoading) {
    return (
      <SlideUp>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton height={400} className="rounded-2xl" />
          <Skeleton height={400} className="rounded-2xl" />
        </div>
      </SlideUp>
    )
  }

  if (!overview && !profile) return null

  return (
    <SlideUp>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {overview?.Description && (
          <Card variant="elevated" hover={false} className="p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Company Description
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {overview.Description}
            </p>
          </Card>
        )}

        <Card variant="elevated" hover={false} className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Company Details
          </h3>

          <div className="space-y-4">
            {overview?.Sector && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Sector
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {overview.Sector}
                </span>
              </div>
            )}

            {overview?.Industry && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Industry
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {overview.Industry}
                </span>
              </div>
            )}

            {overview?.MarketCapitalization && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Market Cap
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatLargeNumber(overview.MarketCapitalization)}
                </span>
              </div>
            )}

            {overview?.PERatio && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  P/E Ratio
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {overview.PERatio}
                </span>
              </div>
            )}

            {overview?.DividendYield && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Dividend Yield
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {parseFloat(overview.DividendYield).toFixed(2)}%
                </span>
              </div>
            )}

            {overview?.EPS && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  EPS
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  ${parseFloat(overview.EPS).toFixed(2)}
                </span>
              </div>
            )}

            {profile?.ceo && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  CEO
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profile.ceo}
                </span>
              </div>
            )}

            {profile?.website && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Website
                </span>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </Card>
      </div>
    </SlideUp>
  )
}

