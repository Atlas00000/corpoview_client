'use client'

import { Container, Section } from '@/components/layout'
import EnhancedStockQuotesGrid from './EnhancedStockQuotesGrid'
import EnhancedCryptoMarketGrid from './EnhancedCryptoMarketGrid'
import EnhancedFXPairsGrid from './EnhancedFXPairsGrid'
import MarketStatus from './MarketStatus'
import { FadeIn } from '@/components/effects'

export default function MarketOverviewSection() {
  return (
    <Section spacing="lg">
      <Container size="wide">
        <FadeIn>
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Market Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
              Get a comprehensive view of global financial markets at a glance. Monitor real-time stock quotes from major exchanges, 
              track cryptocurrency market capitalization and trading volumes, observe foreign exchange rate fluctuations across major currency pairs, 
              and stay informed about market trading sessions. This unified dashboard provides essential market intelligence to help you make 
              timely investment decisions across equities, digital assets, and currency markets.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-8">
          <FadeIn delay={0.1}>
            <MarketStatus />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Top Stocks
              </h3>
              <EnhancedStockQuotesGrid />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Cryptocurrency Market
              </h3>
              <EnhancedCryptoMarketGrid />
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <EnhancedFXPairsGrid />
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}

