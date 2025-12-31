'use client'

import { Container, Section } from '@/components/layout'
import StockDetailHeader from './StockDetailHeader'
import StockDetailChart from './StockDetailChart'
import StockDetailOverview from './StockDetailOverview'
import { FadeIn } from '@/components/effects'

export interface StockDetailPageProps {
  symbol: string
}

export default function StockDetailPage({ symbol }: StockDetailPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <StockDetailHeader symbol={symbol} />
            </FadeIn>

            <FadeIn delay={0.1}>
              <StockDetailChart symbol={symbol} />
            </FadeIn>

            <FadeIn delay={0.2}>
              <StockDetailOverview symbol={symbol} />
            </FadeIn>
          </div>
        </Container>
      </Section>
    </div>
  )
}

