'use client'

import { Container, Section, Grid } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import StockChartCard from './StockChartCard'
import EnhancedCryptoPriceHistoryGrid from './EnhancedCryptoPriceHistoryGrid'
import EnhancedFXRateTrendsGrid from './EnhancedFXRateTrendsGrid'

export default function InteractiveChartGallerySection() {
  return (
    <Section spacing="lg">
      <Container size="wide">
        <FadeIn>
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Interactive Chart Gallery
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
              Explore comprehensive market visualization tools featuring interactive stock price charts with candlestick and line patterns, 
              cryptocurrency historical price movements across multiple timeframes, and foreign exchange rate trends. All charts support 
              advanced interactions including zoom, pan, brush selection, and customizable date ranges to help you analyze market patterns, 
              identify trends, and make informed investment decisions with precision.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-12">
          <FadeIn delay={0.1}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Stock Price Charts
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Analyze equity price movements through dynamic line charts showing closing price trends and candlestick patterns 
                    revealing open, high, low, and close data. Both visualization types include interactive tooltips, zoom capabilities, 
                    and time-based filtering to examine historical performance and identify trading opportunities.
                  </p>
                </div>
              </div>

              <Grid cols={2} gap="lg" className="mb-8">
                <StockChartCard
                  symbol="AAPL"
                  name="Apple Inc."
                  chartType="line"
                  defaultRange="30d"
                />
                <StockChartCard
                  symbol="TSLA"
                  name="Tesla Inc."
                  chartType="candlestick"
                  defaultRange="30d"
                />
              </Grid>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <EnhancedCryptoPriceHistoryGrid />
          </FadeIn>

          <FadeIn delay={0.3}>
            <EnhancedFXRateTrendsGrid />
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}

