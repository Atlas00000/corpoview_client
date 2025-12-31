'use client'

import { Container, Section } from '@/components/layout'
import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import CryptoDetailHeader from './CryptoDetailHeader'
import CryptoDetailChart from './CryptoDetailChart'
import CryptoDetailMarketData from './CryptoDetailMarketData'
import { FadeIn } from '@/components/effects'

export interface CryptoDetailPageProps {
  cryptoId: string
}

export default function CryptoDetailPage({ cryptoId }: CryptoDetailPageProps) {
  const { markets } = useCryptoMarkets('usd', undefined, 100)
  const crypto = markets?.find((coin) => coin.id === cryptoId)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <CryptoDetailHeader cryptoId={cryptoId} />
            </FadeIn>

            <FadeIn delay={0.1}>
              <CryptoDetailChart
                cryptoId={cryptoId}
                symbol={crypto?.symbol || cryptoId}
                name={crypto?.name}
              />
            </FadeIn>

            <FadeIn delay={0.2}>
              <CryptoDetailMarketData cryptoId={cryptoId} />
            </FadeIn>
          </div>
        </Container>
      </Section>
    </div>
  )
}

