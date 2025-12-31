'use client'

import { useMemo } from 'react'
import { useBusinessNews } from '@/lib/hooks/useNewsData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { IconFlame } from '@/components/icons'
import Link from 'next/link'

export interface TrendingTopicsWidgetProps {
  limit?: number
}

function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'stock', 'stocks', 'market',
    'markets', 'company', 'companies', 'business', 'news', 'report', 'reports', 'says', 'said',
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word))
}

export default function TrendingTopicsWidget({ limit = 20 }: TrendingTopicsWidgetProps) {
  const { articles, isLoading } = useBusinessNews(limit * 2)

  const trendingTopics = useMemo(() => {
    const topicCounts: Record<string, number> = {}
    
    articles.forEach((article) => {
      const text = `${article.title} ${article.description || ''}`
      const keywords = extractKeywords(text)
      
      keywords.forEach((keyword) => {
        topicCounts[keyword] = (topicCounts[keyword] || 0) + 1
      })
    })

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        intensity: Math.min(100, (item.count / Math.max(...Object.values(topicCounts))) * 100),
      }))
  }, [articles])

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={300} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <IconFlame className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Trending Topics
          </h3>
        </div>

        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Link href={`/news?q=${encodeURIComponent(topic.topic)}`}>
                <div className="p-4 rounded-xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-400 dark:text-slate-500 w-6">
                        #{topic.rank}
                      </span>
                      <span className="text-base font-semibold text-slate-900 dark:text-slate-100 capitalize group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.topic}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {topic.count} articles
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.intensity}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Card>
    </SlideUp>
  )
}

