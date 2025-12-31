'use client'

import { useEarningsCalendar } from '@/lib/hooks/useStockData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { IconCalendar } from '@/components/icons'
import Link from 'next/link'

export interface EarningsCalendarWidgetProps {
  limit?: number
}

export default function EarningsCalendarWidget({ limit = 10 }: EarningsCalendarWidgetProps) {
  const { calendar, isLoading } = useEarningsCalendar()

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={400} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  const upcomingEarnings = calendar
    .slice()
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.earningsDate || 0).getTime()
      const dateB = new Date(b.date || b.earningsDate || 0).getTime()
      return dateA - dateB
    })
    .filter((item: any) => {
      const earningsDate = new Date(item.date || item.earningsDate || 0)
      return earningsDate >= new Date()
    })
    .slice(0, limit)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    )
  }

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <IconCalendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Earnings Calendar
          </h3>
        </div>

        {upcomingEarnings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No upcoming earnings announcements found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEarnings.map((item: any, index: number) => {
              const earningsDate = item.date || item.earningsDate
              const dateLabel = isToday(earningsDate)
                ? 'Today'
                : isTomorrow(earningsDate)
                ? 'Tomorrow'
                : formatDate(earningsDate)

              return (
                <motion.div
                  key={`${item.symbol}-${earningsDate}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/stocks/${item.symbol}`}>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              {item.symbol}
                            </span>
                            {item.companyName && (
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {item.companyName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <IconCalendar className="w-4 h-4" />
                              {dateLabel}
                            </span>
                            {item.epsEstimated && (
                              <span>EPS Est: ${parseFloat(item.epsEstimated).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {isToday(earningsDate) && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </Card>
    </SlideUp>
  )
}

