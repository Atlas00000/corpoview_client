import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load corporate page component
const CorporateIntelligencePage = lazy(() => import('@/components/corporate/CorporateIntelligencePage'))

export default function CorporatePage() {
  return (
    <>
      <Header />
      <LazySuspense>
        <CorporateIntelligencePage symbol="AAPL" />
      </LazySuspense>
    </>
  )
}

