'use client'

import { useState } from 'react'
import { Container, Section, Grid } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import CompanyProfileCard from './CompanyProfileCard'
import FinancialHealthDashboard from './FinancialHealthDashboard'
import EarningsCalendarWidget from './EarningsCalendarWidget'
import SectorComparisonChart from './SectorComparisonChart'
import { useCompanyOverview } from '@/lib/hooks/useStockData'

const SECTOR_SAMPLES: Record<string, string[]> = {
  Technology: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'],
  Financial: ['JPM', 'BAC', 'GS', 'WFC', 'C'],
  Healthcare: ['JNJ', 'PFE', 'UNH', 'ABBV', 'TMO'],
  Consumer: ['AMZN', 'TSLA', 'HD', 'NKE', 'SBUX'],
  Energy: ['XOM', 'CVX', 'COP', 'SLB', 'EOG'],
}

export interface CorporateIntelligencePageProps {
  symbol?: string
}

export default function CorporateIntelligencePage({
  symbol = 'AAPL',
}: CorporateIntelligencePageProps) {
  const { overview } = useCompanyOverview(symbol)
  const sector = overview?.Sector || 'Technology'
  const sectorSymbols = SECTOR_SAMPLES[sector] || SECTOR_SAMPLES['Technology']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Corporate Intelligence Hub
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Comprehensive company insights, financial health, and market intelligence
                </p>
              </div>
            </FadeIn>

            {symbol && (
              <>
                <FadeIn delay={0.1}>
                  <CompanyProfileCard symbol={symbol} />
                </FadeIn>

                <FadeIn delay={0.2}>
                  <FinancialHealthDashboard symbol={symbol} />
                </FadeIn>
              </>
            )}

            <FadeIn delay={0.3}>
              <Grid cols={1} lg={2} gap="lg">
                <EarningsCalendarWidget limit={8} />
                <SectorComparisonChart
                  symbols={sectorSymbols}
                  sectorName={sector}
                />
              </Grid>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </div>
  )
}

