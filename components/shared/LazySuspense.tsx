'use client'

import { Suspense, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/effects'

export interface LazySuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

/**
 * Suspense wrapper with a default loading fallback
 * Used for lazy-loaded components
 */
export default function LazySuspense({
  children,
  fallback,
  className = '',
}: LazySuspenseProps) {
  const defaultFallback = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center min-h-[200px] ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    </motion.div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

/**
 * Skeleton-based fallback for sections
 */
export function SectionSuspense({
  children,
  skeletonHeight = 400,
  className = '',
}: {
  children: ReactNode
  skeletonHeight?: number
  className?: string
}) {
  return (
    <Suspense
      fallback={
        <div className={className}>
          <Skeleton height={skeletonHeight} className="rounded-3xl" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

