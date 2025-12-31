'use client'

import { useCompanyProfile, useCompanyOverview } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { IconBuilding, IconMapPin, IconUser, IconBriefcase } from '@/components/icons'

export interface CompanyProfileCardProps {
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

export default function CompanyProfileCard({ symbol }: CompanyProfileCardProps) {
  const { profile, isLoading: profileLoading } = useCompanyProfile(symbol)
  const { overview, isLoading: overviewLoading } = useCompanyOverview(symbol)

  if (profileLoading || overviewLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={300} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  if (!profile && !overview) return null

  const profileData = [
    {
      label: 'Sector',
      value: overview?.Sector || profile?.sector || 'N/A',
      icon: <IconBriefcase className="w-5 h-5" />,
    },
    {
      label: 'Industry',
      value: overview?.Industry || profile?.industry || 'N/A',
      icon: <IconBuilding className="w-5 h-5" />,
    },
    {
      label: 'CEO',
      value: profile?.ceo || 'N/A',
      icon: <IconUser className="w-5 h-5" />,
    },
    {
      label: 'Headquarters',
      value: profile?.address || profile?.city
        ? `${profile.city || ''}${profile.city && profile.state ? ', ' : ''}${profile.state || ''}`
        : 'N/A',
      icon: <IconMapPin className="w-5 h-5" />,
    },
  ]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Company Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {profileData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 dark:from-primary-900/20 dark:via-slate-800 dark:to-secondary-900/20 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 ml-12">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        {(overview?.MarketCapitalization || profile?.marketCap) && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overview?.MarketCapitalization && (
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Market Cap
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatLargeNumber(overview.MarketCapitalization)}
                  </p>
                </div>
              )}

              {overview?.PERatio && (
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    P/E Ratio
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {overview.PERatio}
                  </p>
                </div>
              )}

              {overview?.EPS && (
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    EPS
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    ${parseFloat(overview.EPS).toFixed(2)}
                  </p>
                </div>
              )}

              {overview?.DividendYield && (
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Dividend Yield
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {parseFloat(overview.DividendYield).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </SlideUp>
  )
}

