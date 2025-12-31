'use client'

import { useBusinessNews } from '@/lib/hooks/useNewsData'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { IconTrendingUp, IconTrendingDown, IconActivity } from '@/components/icons'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface MarketAnalysisSectionProps {
  limit?: number
}

function calculateSentimentScore(title: string, description: string | null): number {
  const text = `${title} ${description || ''}`.toLowerCase()
  const positiveWords = ['gain', 'surge', 'rally', 'up', 'rise', 'growth', 'profit', 'beat', 'strong', 'bullish', 'boost', 'soar']
  const negativeWords = ['fall', 'drop', 'decline', 'down', 'loss', 'crash', 'miss', 'weak', 'bearish', 'plunge', 'slump', 'tumble']
  
  let score = 0
  positiveWords.forEach((word) => {
    if (text.includes(word)) score += 1
  })
  negativeWords.forEach((word) => {
    if (text.includes(word)) score -= 1
  })
  
  return Math.max(-100, Math.min(100, (score / Math.max(positiveWords.length, negativeWords.length)) * 100))
}

export default function MarketAnalysisSection({ limit = 50 }: MarketAnalysisSectionProps) {
  const { articles, isLoading } = useBusinessNews(limit)

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <Skeleton height={400} className="rounded-xl" />
        </Card>
      </SlideUp>
    )
  }

  const sentimentData = articles.map((article) => ({
    title: article.title.substring(0, 30) + '...',
    sentiment: calculateSentimentScore(article.title, article.description),
    date: new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const dailySentiment = sentimentData.reduce((acc, item) => {
    const date = item.date
    if (!acc[date]) {
      acc[date] = { date, total: 0, count: 0 }
    }
    acc[date].total += item.sentiment
    acc[date].count += 1
    return acc
  }, {} as Record<string, { date: string; total: number; count: number }>)

  const dailySentimentChart = Object.values(dailySentiment)
    .map((item) => ({
      date: item.date,
      sentiment: item.total / item.count,
    }))
    .slice(-7)
    .reverse()

  const averageSentiment = sentimentData.reduce((sum, item) => sum + item.sentiment, 0) / sentimentData.length
  const positiveCount = sentimentData.filter((item) => item.sentiment > 20).length
  const negativeCount = sentimentData.filter((item) => item.sentiment < -20).length
  const neutralCount = sentimentData.length - positiveCount - negativeCount

  const sentimentDistribution = [
    { name: 'Positive', value: positiveCount, color: '#10b981' },
    { name: 'Neutral', value: neutralCount, color: '#64748b' },
    { name: 'Negative', value: negativeCount, color: '#f43f5e' },
  ]

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <IconActivity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Market Analysis & Sentiment
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl ${
              averageSentiment >= 20
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : averageSentiment <= -20
                ? 'bg-gradient-to-br from-rose-500 to-rose-600'
                : 'bg-gradient-to-br from-slate-500 to-slate-600'
            } text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90 mb-2">Average Sentiment</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">
                {averageSentiment >= 20 ? (
                  <IconTrendingUp size={32} />
                ) : averageSentiment <= -20 ? (
                  <IconTrendingDown size={32} />
                ) : (
                  <IconActivity size={32} />
                )}
              </p>
              <div>
                <p className="text-2xl font-bold">{averageSentiment.toFixed(1)}</p>
                <p className="text-xs opacity-80">
                  {averageSentiment >= 20 ? 'Bullish' : averageSentiment <= -20 ? 'Bearish' : 'Neutral'}
                </p>
              </div>
            </div>
          </motion.div>

          {sentimentDistribution.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{item.name}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{item.value}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.value / articles.length) * 100}%`,
                    }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {((item.value / articles.length) * 100).toFixed(0)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              7-Day Sentiment Trend
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailySentimentChart}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={averageSentiment >= 0 ? '#10b981' : '#f43f5e'}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={averageSentiment >= 0 ? '#10b981' : '#f43f5e'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  domain={[-100, 100]}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}`, 'Sentiment']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sentiment"
                  stroke={averageSentiment >= 0 ? '#10b981' : '#f43f5e'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSentiment)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Sentiment Distribution
            </h4>
            <div className="space-y-3">
              {sentimentDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.value / articles.length) * 100}%`,
                        }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-8 text-right">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </SlideUp>
  )
}

