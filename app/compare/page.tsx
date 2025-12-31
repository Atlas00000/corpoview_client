import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load comparison page component
const MultiAssetComparisonPage = lazy(() => import('@/components/comparison/MultiAssetComparisonPage'))

export default function ComparePage() {
  return (
    <>
      <Header />
      <LazySuspense>
        <MultiAssetComparisonPage />
      </LazySuspense>
    </>
  )
}

