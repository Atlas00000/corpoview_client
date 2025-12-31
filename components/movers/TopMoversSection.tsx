'use client'

import { Container, Section } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import StockGainersList from './StockGainersList'
import EnhancedStockLosersGrid from './EnhancedStockLosersGrid'
import EnhancedCryptoPerformersGrid from './EnhancedCryptoPerformersGrid'

export default function TopMoversSection() {
  return (
    <Section spacing="lg">
      <Container size="wide">
        <FadeIn>
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Top Movers & Shakers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
              Track the most significant market movements across major asset classes. Monitor stocks experiencing the largest percentage gains 
              and losses during the trading session, alongside top-performing cryptocurrencies ranked by 24-hour price appreciation. This comprehensive 
              view helps you identify emerging trends, spot volatility patterns, and discover opportunities in both traditional equities and 
              digital assets as they unfold in real-time.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-12">
          <FadeIn delay={0.1}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-success-500 to-success-600 rounded-full" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Biggest Stock Gainers
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Discover which equities are leading the market with the strongest upward momentum, ranked by percentage gains. 
                    These top performers reflect companies experiencing positive catalysts, strong earnings reports, or favorable market conditions.
                  </p>
                </div>
              </div>
              <StockGainersList />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-danger-500 to-danger-600 rounded-full" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Biggest Stock Losers
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Identify stocks facing downward pressure with the most significant percentage declines. These underperformers may indicate 
                    sector rotations, disappointing earnings, or broader market headwinds affecting specific companies or industries.
                  </p>
                </div>
              </div>
              <EnhancedStockLosersGrid />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Top Cryptocurrency Performers
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor the digital currency markets for the most volatile and rapidly appreciating cryptocurrencies over the past 24 hours. 
                    These metrics highlight tokens with exceptional momentum, whether driven by adoption news, technological developments, or 
                    market sentiment shifts in the decentralized finance ecosystem.
                  </p>
                </div>
              </div>
              <EnhancedCryptoPerformersGrid />
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}

