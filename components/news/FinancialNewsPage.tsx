'use client'

import { useState } from 'react'
import { Container, Section, Grid } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import BreakingNewsFeed from './BreakingNewsFeed'
import NewsSearchFilter from './NewsSearchFilter'
import MarketAnalysisSection from './MarketAnalysisSection'
import TrendingTopicsWidget from './TrendingTopicsWidget'
import { motion } from 'framer-motion'

export interface FinancialNewsPageProps {
  symbol?: string
}

const tabs = [
  { id: 'feed', label: 'Breaking News' },
  { id: 'search', label: 'Search & Filter' },
  { id: 'analysis', label: 'Market Analysis' },
] as const

export default function FinancialNewsPage({ symbol }: FinancialNewsPageProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('feed')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Financial News & Insights
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Stay informed with the latest business news, market analysis, and financial insights
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-6 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-600 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </FadeIn>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'feed' && (
                <FadeIn delay={0.2}>
                  <div className="space-y-8">
                    <BreakingNewsFeed limit={12} />
                    <Grid cols={1} lg={2} gap="lg">
                      <TrendingTopicsWidget limit={30} />
                      <MarketAnalysisSection limit={50} />
                    </Grid>
                  </div>
                </FadeIn>
              )}
              {activeTab === 'search' && (
                <FadeIn delay={0.2}>
                  <NewsSearchFilter limit={20} />
                </FadeIn>
              )}
              {activeTab === 'analysis' && (
                <FadeIn delay={0.2}>
                  <div className="space-y-8">
                    <MarketAnalysisSection limit={50} />
                    <TrendingTopicsWidget limit={30} />
                  </div>
                </FadeIn>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

