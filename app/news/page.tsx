import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load news page component
const FinancialNewsPage = lazy(() => import('@/components/news/FinancialNewsPage'))

export default function NewsPage() {
  return (
    <>
      <Header />
      <LazySuspense>
        <FinancialNewsPage />
      </LazySuspense>
    </>
  )
}

