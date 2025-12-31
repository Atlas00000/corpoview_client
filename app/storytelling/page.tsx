import { lazy } from 'react'
import Header from '@/components/shared/Header'
import LazySuspense from '@/components/shared/LazySuspense'

// Lazy load storytelling page component
const DataStorytellingPage = lazy(() => import('@/components/storytelling/DataStorytellingPage'))

export default function StorytellingPage() {
  return (
    <>
      <Header />
      <LazySuspense>
        <DataStorytellingPage />
      </LazySuspense>
    </>
  )
}

