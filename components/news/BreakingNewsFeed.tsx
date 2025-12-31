'use client'

import { useState, useMemo } from 'react'
import { useBusinessNews, useTopHeadlines } from '@/lib/hooks/useNewsData'
import { SlideUp, Skeleton, StaggerContainer, StaggerItem } from '@/components/effects'
import { Card } from '@/components/ui'
import NewsArticleCard from './NewsArticleCard'
import { IconTrendingUp, IconRefresh, IconChartBar } from '@/components/icons'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export interface BreakingNewsFeedProps {
  limit?: number
}

const categories = [
  { id: 'business', label: 'Business', color: '#3b82f6' },
  { id: 'technology', label: 'Technology', color: '#10b981' },
  { id: 'general', label: 'General', color: '#6366f1' },
]

export default function BreakingNewsFeed({ limit = 12 }: BreakingNewsFeedProps) {
  const [category, setCategory] = useState<string | undefined>('business')
  const { articles, isLoading, mutate } = category === 'business'
    ? useBusinessNews(limit)
    : useTopHeadlines(category, 'us', limit)

  const featuredArticle = articles[0]
  const regularArticles = articles.slice(1)

  const newsByHour = useMemo(() => {
    const hourCounts: Record<number, number> = {}
    articles.forEach((article) => {
      const hour = new Date(article.publishedAt).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourCounts[i] || 0,
    }))
  }, [articles])

  const sourceDistribution = useMemo(() => {
    const sourceCounts: Record<string, number> = {}
    articles.forEach((article) => {
      const source = article.source
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })
    return Object.entries(sourceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [articles])

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <IconTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Breaking News Feed
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => mutate()}
            className="flex items-center gap-2"
          >
            <IconRefresh size={18} />
            Refresh
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  category === cat.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {!isLoading && articles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconChartBar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    News Distribution by Hour
                  </h4>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={newsByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="hour"
                      stroke="#64748b"
                      style={{ fontSize: '10px' }}
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                    <Tooltip
                      formatter={(value: number) => [`${value} articles`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {newsByHour.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3b82f6" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Top Sources
                </h4>
                <div className="space-y-2">
                  {sourceDistribution.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                        {source.name}
                      </span>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(source.value / Math.max(...sourceDistribution.map((s) => s.value))) * 100}%`,
                            }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-primary-600 rounded-full"
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-6 text-right">
                          {source.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} height={400} className="rounded-xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No news articles available
            </p>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <div className="mb-6">
                <NewsArticleCard article={featuredArticle} index={0} variant="featured" />
              </div>
            )}

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article, index) => (
                <StaggerItem key={`${article.url}-${index}`}>
                  <NewsArticleCard article={article} index={index + 1} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}
      </Card>
    </SlideUp>
  )
}

