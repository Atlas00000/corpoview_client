'use client'

import { useState, useMemo } from 'react'
import { useNewsSearch } from '@/lib/hooks/useNewsData'
import { SlideUp, Skeleton, StaggerContainer, StaggerItem } from '@/components/effects'
import { Card } from '@/components/ui'
import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'
import NewsArticleCard from './NewsArticleCard'
import { IconSearch, IconX } from '@/components/icons'
import { motion, AnimatePresence } from 'framer-motion'

export interface NewsSearchFilterProps {
  initialQuery?: string
  limit?: number
}

const sortOptions = [
  { value: 'publishedAt', label: 'Most Recent' },
  { value: 'relevancy', label: 'Most Relevant' },
  { value: 'popularity', label: 'Most Popular' },
]

export default function NewsSearchFilter({ initialQuery = '', limit = 20 }: NewsSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState('publishedAt')
  const [activeQuery, setActiveQuery] = useState(initialQuery)

  const { articles, isLoading } = useNewsSearch(
    activeQuery || null,
    'en',
    sortBy,
    limit
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim())
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setActiveQuery('')
  }

  const filteredArticles = useMemo(() => {
    if (!articles) return []
    return articles.filter((article) => {
      const query = activeQuery.toLowerCase()
      return (
        article.title.toLowerCase().includes(query) ||
        (article.description && article.description.toLowerCase().includes(query)) ||
        article.source.toLowerCase().includes(query)
      )
    })
  }, [articles, activeQuery])

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          News Search & Filter
        </h3>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for news articles..."
                className="w-full pl-10 pr-10"
                id="news-search"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <IconX size={20} />
                </button>
              )}
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>

        {activeQuery && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Showing results for: <strong className="text-slate-900 dark:text-slate-100">{activeQuery}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortBy === option.value
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: limit }).map((_, i) => (
                <Skeleton key={i} height={400} className="rounded-xl" />
              ))}
            </motion.div>
          ) : !activeQuery ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <IconSearch className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Search for news articles
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Enter keywords, topics, or company names to find relevant news
              </p>
            </motion.div>
          ) : filteredArticles.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No results found
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Try different keywords or clear your search
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <StaggerItem key={`${article.url}-${index}`}>
                    <NewsArticleCard article={article} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </SlideUp>
  )
}

