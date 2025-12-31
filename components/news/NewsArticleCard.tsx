'use client'

import { motion } from 'framer-motion'
import { NewsArticle } from '@/lib/hooks/useNewsData'
import { Card } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { IconExternalLink, IconClock } from '@/components/icons'

export interface NewsArticleCardProps {
  article: NewsArticle
  index?: number
  variant?: 'default' | 'featured' | 'compact'
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function truncateText(text: string | null, maxLength: number = 150): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function NewsArticleCard({
  article,
  index = 0,
  variant = 'default',
}: NewsArticleCardProps) {
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={isFeatured ? 'lg:col-span-2' : ''}
    >
      <Link href={article.url} target="_blank" rel="noopener noreferrer">
        <Card
          variant="elevated"
          hover
          className={`overflow-hidden h-full transition-all duration-300 ${
            isFeatured ? 'p-0' : 'p-0'
          }`}
        >
          <div className={`flex ${isFeatured && !isCompact ? 'lg:flex-row flex-col' : 'flex-col'} h-full`}>
            {article.urlToImage && (
              <div
                className={`relative ${
                  isFeatured && !isCompact
                    ? 'lg:w-1/2 w-full lg:h-auto h-64'
                    : isCompact
                    ? 'w-full h-32'
                    : 'w-full h-48'
                } bg-slate-200 dark:bg-slate-700 overflow-hidden`}
              >
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes={isFeatured ? '(max-width: 1024px) 100vw, 50vw' : '100vw'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            )}

            <div
              className={`flex flex-col justify-between ${
                isFeatured && !isCompact ? 'lg:w-1/2 w-full p-6' : isCompact ? 'p-4' : 'p-6'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {article.source}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <IconClock size={14} />
                    {formatTimeAgo(article.publishedAt)}
                  </div>
                </div>

                <h3
                  className={`font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
                    isFeatured ? 'text-2xl lg:text-3xl' : isCompact ? 'text-base' : 'text-xl'
                  }`}
                >
                  {article.title}
                </h3>

                {article.description && !isCompact && (
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {truncateText(article.description, isFeatured ? 200 : 120)}
                  </p>
                )}

                {article.author && !isCompact && (
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                    By {article.author}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-2">
                  Read Article
                  <IconExternalLink size={16} />
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

