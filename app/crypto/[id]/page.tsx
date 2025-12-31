import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load detail page component
const CryptoDetailPage = lazy(() => import('@/components/assets/detail/CryptoDetailPage'))

export default function CryptoPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <LazySuspense>
        <CryptoDetailPage cryptoId={params.id} />
      </LazySuspense>
    </>
  )
}

