import { lazy } from 'react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load heavy sections
const MarketOverviewSection = lazy(() => import('@/components/market/MarketOverviewSection'))
const TopMoversSection = lazy(() => import('@/components/movers/TopMoversSection'))
const InteractiveChartGallerySection = lazy(() => import('@/components/charts/gallery/InteractiveChartGallerySection'))

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">
        <LazySuspense>
          <MarketOverviewSection />
        </LazySuspense>
        <LazySuspense>
          <TopMoversSection />
        </LazySuspense>
        <LazySuspense>
          <InteractiveChartGallerySection />
        </LazySuspense>
      </main>
      <Footer />
    </div>
  )
}
