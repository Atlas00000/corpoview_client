import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load detail page component
const StockDetailPage = lazy(() => import('@/components/assets/detail/StockDetailPage'))

export default function StockPage({ params }: { params: { symbol: string } }) {
  return (
    <>
      <Header />
      <LazySuspense>
        <StockDetailPage symbol={params.symbol.toUpperCase()} />
      </LazySuspense>
    </>
  )
}

