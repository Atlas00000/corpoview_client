'use client'

import { useState } from 'react'
import { Container, Section } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import CorrelationAnalysis from './CorrelationAnalysis'
import VolatilityIndicators from './VolatilityIndicators'
import VolumeAnalysis from './VolumeAnalysis'
import PerformanceAttribution from './PerformanceAttribution'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'
import { IconX } from '@/components/icons'

export interface AdvancedAnalyticsPageProps {
  initialType?: 'correlation' | 'volatility' | 'volume' | 'attribution'
}

const tabs = [
  { id: 'correlation', label: 'Correlation Analysis' },
  { id: 'volatility', label: 'Volatility Indicators' },
  { id: 'volume', label: 'Volume Analysis' },
  { id: 'attribution', label: 'Performance Attribution' },
] as const

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL']

export default function AdvancedAnalyticsPage({ initialType = 'correlation' }: AdvancedAnalyticsPageProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>(initialType)
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_SYMBOLS)
  const [singleSymbol, setSingleSymbol] = useState('AAPL')
  const [newSymbol, setNewSymbol] = useState('')

  const handleAddSymbol = () => {
    if (newSymbol && !symbols.includes(newSymbol.toUpperCase())) {
      setSymbols([...symbols, newSymbol.toUpperCase()])
      setNewSymbol('')
    }
  }

  const handleRemoveSymbol = (symbol: string) => {
    setSymbols(symbols.filter((s) => s !== symbol))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Advanced Analytics
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-3xl">
                  Unlock deeper market intelligence with comprehensive analytical tools. Our advanced analytics platform provides institutional-grade insights through correlation analysis, volatility indicators, volume metrics, and performance attribution models. Make data-driven decisions with real-time market intelligence.
                </p>
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Transform raw market data into actionable insights.</strong> Whether you're analyzing portfolio diversification through correlation matrices, assessing risk with volatility indicators, understanding market sentiment through volume patterns, or breaking down performance drivers with attribution analysis, our tools provide the depth and clarity you need for informed decision-making.
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

            {activeTab === 'correlation' && (
              <FadeIn delay={0.15}>
                <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      type="text"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value)}
                      placeholder="Enter stock symbol (e.g., AAPL)"
                      className="flex-1"
                      id="new-symbol-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
                    />
                    <Button onClick={handleAddSymbol} variant="primary">
                      Add Symbol
                    </Button>
                  </div>
                  {symbols.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {symbols.map((symbol) => (
                        <span
                          key={symbol}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                        >
                          {symbol}
                          <button
                            onClick={() => handleRemoveSymbol(symbol)}
                            className="hover:text-primary-900 dark:hover:text-primary-100"
                          >
                            <IconX size={16} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <CorrelationAnalysis symbols={symbols} />
              </FadeIn>
            )}

            {(activeTab === 'volatility' || activeTab === 'volume' || activeTab === 'attribution') && (
              <FadeIn delay={0.15}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Symbol
                  </label>
                  <Input
                    type="text"
                    value={singleSymbol}
                    onChange={(e) => setSingleSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter stock symbol"
                    className="max-w-xs"
                    id="symbol-input"
                  />
                </div>
              </FadeIn>
            )}

            {activeTab === 'volatility' && (
              <FadeIn delay={0.2}>
                <VolatilityIndicators symbol={singleSymbol} />
              </FadeIn>
            )}

            {activeTab === 'volume' && (
              <FadeIn delay={0.2}>
                <VolumeAnalysis symbol={singleSymbol} />
              </FadeIn>
            )}

            {activeTab === 'attribution' && (
              <FadeIn delay={0.2}>
                <PerformanceAttribution symbol={singleSymbol} />
              </FadeIn>
            )}
          </div>
        </Container>
      </Section>
    </div>
  )
}

