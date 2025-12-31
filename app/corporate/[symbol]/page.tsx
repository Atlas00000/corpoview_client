import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load corporate intelligence component
const CorporateIntelligencePage = lazy(() => import('@/components/corporate/CorporateIntelligencePage'))

export default function CorporateSymbolPage({ params }: { params: { symbol: string } }) {
  return (
    <>
      <Header />
      <LazySuspense>
        <CorporateIntelligencePage symbol={params.symbol.toUpperCase()} />
      </LazySuspense>
    </>
  )
}

