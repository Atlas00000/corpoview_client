import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load analytics page component
const AdvancedAnalyticsPage = lazy(() => import('@/components/analytics/AdvancedAnalyticsPage'))

export default function AnalyticsPage() {
  return (
    <>
      <Header />
      <LazySuspense>
        <AdvancedAnalyticsPage />
      </LazySuspense>
    </>
  )
}

