'use client'

import { useState } from 'react'
import { Container, Section } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import IncomeStatementViewer from './IncomeStatementViewer'
import BalanceSheetViewer from './BalanceSheetViewer'
import CashFlowViewer from './CashFlowViewer'
import FinancialRatios from './FinancialRatios'
import { motion } from 'framer-motion'

export interface FinancialStatementsViewerProps {
  symbol: string
}

const tabs = [
  { id: 'income', label: 'Income Statement' },
  { id: 'balance', label: 'Balance Sheet' },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'ratios', label: 'Financial Ratios' },
] as const

export default function FinancialStatementsViewer({ symbol }: FinancialStatementsViewerProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('income')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Financial Statements Viewer
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Comprehensive financial statements and ratios analysis
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
              {activeTab === 'income' && (
                <FadeIn delay={0.2}>
                  <IncomeStatementViewer symbol={symbol} />
                </FadeIn>
              )}
              {activeTab === 'balance' && (
                <FadeIn delay={0.2}>
                  <BalanceSheetViewer symbol={symbol} />
                </FadeIn>
              )}
              {activeTab === 'cashflow' && (
                <FadeIn delay={0.2}>
                  <CashFlowViewer symbol={symbol} />
                </FadeIn>
              )}
              {activeTab === 'ratios' && (
                <FadeIn delay={0.2}>
                  <FinancialRatios symbol={symbol} />
                </FadeIn>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

