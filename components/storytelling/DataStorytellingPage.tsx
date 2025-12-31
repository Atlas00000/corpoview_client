'use client'

import { useState } from 'react'
import { Container, Section } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import TrendAnalysisNarrative from './TrendAnalysisNarrative'
import MarketInsightsSummary from './MarketInsightsSummary'
import PerformanceExplanation from './PerformanceExplanation'
import CorrelationInsights from './CorrelationInsights'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui'

export interface DataStorytellingPageProps {
  symbol?: string
  compareSymbols?: string[]
}

const tabs = [
  { id: 'trend', label: 'Trend Analysis' },
  { id: 'market', label: 'Market Insights' },
  { id: 'performance', label: 'Performance' },
  { id: 'correlation', label: 'Correlation' },
] as const

export default function DataStorytellingPage({
  symbol = 'AAPL',
  compareSymbols = ['AAPL', 'MSFT'],
}: DataStorytellingPageProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('trend')
  const [selectedSymbol, setSelectedSymbol] = useState(symbol)
  const [symbol1, setSymbol1] = useState(compareSymbols[0] || 'AAPL')
  const [symbol2, setSymbol2] = useState(compareSymbols[1] || 'MSFT')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Data Storytelling Components
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-3xl">
                  Transform complex financial data into compelling narratives. Our data storytelling platform combines quantitative analysis with narrative insights to help you understand market trends, performance drivers, and investment opportunities through clear, actionable storytelling.
                </p>
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Every number tells a story.</strong> Our storytelling components analyze trends, explain performance metrics, reveal market insights, and uncover correlation patterns. From detailed trend narratives that explain price movements to comprehensive market summaries that contextualize current conditions, these tools help you understand not just what the data shows, but why it matters for your investment strategy.
                  </p>
                </div>
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

            {(activeTab === 'trend' || activeTab === 'performance') && (
              <FadeIn delay={0.15}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Symbol
                  </label>
                  <Input
                    type="text"
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter stock symbol"
                    className="max-w-xs"
                    id="symbol-input"
                  />
                </div>
              </FadeIn>
            )}

            {activeTab === 'correlation' && (
              <FadeIn delay={0.15}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Symbol 1
                    </label>
                    <Input
                      type="text"
                      value={symbol1}
                      onChange={(e) => setSymbol1(e.target.value.toUpperCase())}
                      placeholder="Enter first symbol"
                      id="symbol1-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Symbol 2
                    </label>
                    <Input
                      type="text"
                      value={symbol2}
                      onChange={(e) => setSymbol2(e.target.value.toUpperCase())}
                      placeholder="Enter second symbol"
                      id="symbol2-input"
                    />
                  </div>
                </div>
              </FadeIn>
            )}

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'trend' && (
                <FadeIn delay={0.2}>
                  <TrendAnalysisNarrative symbol={selectedSymbol} period="30d" />
                </FadeIn>
              )}
              {activeTab === 'market' && (
                <FadeIn delay={0.2}>
                  <MarketInsightsSummary />
                </FadeIn>
              )}
              {activeTab === 'performance' && (
                <FadeIn delay={0.2}>
                  <PerformanceExplanation symbol={selectedSymbol} />
                </FadeIn>
              )}
              {activeTab === 'correlation' && (
                <FadeIn delay={0.2}>
                  <CorrelationInsights symbols={[symbol1, symbol2]} />
                </FadeIn>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

