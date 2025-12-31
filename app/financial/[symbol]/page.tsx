import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load financial statements component
const FinancialStatementsViewer = lazy(() => import('@/components/financial/FinancialStatementsViewer'))

export default function FinancialPage({ params }: { params: { symbol: string } }) {
  return (
    <>
      <Header />
      <LazySuspense>
        <FinancialStatementsViewer symbol={params.symbol.toUpperCase()} />
      </LazySuspense>
    </>
  )
}

