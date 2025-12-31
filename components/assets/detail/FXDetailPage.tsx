'use client'

import { Container, Section } from '@/components/layout'
import FXDetailHeader from './FXDetailHeader'
import FXCurrencyConverter from './FXCurrencyConverter'
import FXDetailHistory from './FXDetailHistory'
import { FadeIn } from '@/components/effects'
import { Grid } from '@/components/layout'

export interface FXDetailPageProps {
  from: string
  to: string
}

export default function FXDetailPage({ from, to }: FXDetailPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <FXDetailHeader from={from} to={to} />
            </FadeIn>

            <FadeIn delay={0.1}>
              <Grid cols={1} gap="lg" className="lg:grid-cols-2">
                <FXCurrencyConverter from={from} to={to} />
                <FXDetailHistory from={from} to={to} />
              </Grid>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </div>
  )
}

