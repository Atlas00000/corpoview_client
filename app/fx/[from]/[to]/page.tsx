import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load detail page component
const FXDetailPage = lazy(() => import('@/components/assets/detail/FXDetailPage'))

export default function FXPage({ params }: { params: { from: string; to: string } }) {
  return (
    <>
      <Header />
      <LazySuspense>
        <FXDetailPage from={params.from.toUpperCase()} to={params.to.toUpperCase()} />
      </LazySuspense>
    </>
  )
}

