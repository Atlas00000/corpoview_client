'use client'

import { useStockNews } from '@/lib/hooks/useStockData'
import { SlideUp, Skeleton, StaggerContainer, StaggerItem } from '@/components/effects'
import { Card } from '@/components/ui'
import NewsArticleCard from './NewsArticleCard'
import { IconNews } from '@/components/icons'

export interface StockNewsSectionProps {
  symbol: string
  limit?: number
}

export default function StockNewsSection({ symbol, limit = 9 }: StockNewsSectionProps) {
  const { news, isLoading } = useStockNews(symbol, limit)

  if (isLoading) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <IconNews className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              News for {symbol}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} height={400} className="rounded-xl" />
            ))}
          </div>
        </Card>
      </SlideUp>
    )
  }

  if (!news || news.length === 0) {
    return (
      <SlideUp>
        <Card variant="elevated" hover={false} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <IconNews className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              News for {symbol}
            </h3>
          </div>
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No news articles available for {symbol}
            </p>
          </div>
        </Card>
      </SlideUp>
    )
  }

  const featuredNews = news[0]
  const regularNews = news.slice(1)

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <IconNews className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            News for {symbol}
          </h3>
        </div>

        {featuredNews && (
          <div className="mb-6">
            <NewsArticleCard 
              article={{
                source: featuredNews.source || 'Unknown',
                author: featuredNews.author || null,
                title: featuredNews.title,
                description: featuredNews.description || null,
                url: featuredNews.url,
                urlToImage: featuredNews.image || null,
                publishedAt: featuredNews.published_utc || new Date().toISOString(),
                content: featuredNews.description || null,
              }} 
              index={0} 
              variant="featured" 
            />
          </div>
        )}

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((article, index) => (
            <StaggerItem key={`${article.url}-${index}`}>
              <NewsArticleCard
                article={{
                  source: article.source || 'Unknown',
                  author: article.author || null,
                  title: article.title,
                  description: article.description || null,
                  url: article.url,
                  urlToImage: article.image || null,
                  publishedAt: article.published_utc || new Date().toISOString(),
                  content: article.description || null,
                }}
                index={index + 1}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Card>
    </SlideUp>
  )
}

