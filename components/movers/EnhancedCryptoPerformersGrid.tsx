'use client'

import { useMemo } from 'react'
import { useCryptoMarkets } from '@/lib/hooks/useCryptoData'
import { SlideUp, Skeleton } from '@/components/effects'
import EnhancedCryptoPerformerCard from './EnhancedCryptoPerformerCard'
import { motion } from 'framer-motion'

export default function EnhancedCryptoPerformersGrid() {
  const { markets, isLoading } = useCryptoMarkets('usd', undefined, 100)

  const topPerformers = useMemo(() => {
    if (!markets || markets.length === 0) return []
    
    return markets
      .filter((crypto) => crypto.priceChangePercentage24h !== undefined)
      .sort((a, b) => (b.priceChangePercentage24h || 0) - (a.priceChangePercentage24h || 0))
      .slice(0, 5)
  }, [markets])

  if (isLoading) {
    return (
      <SlideUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={160} className="rounded-3xl" />
          ))}
        </div>
      </SlideUp>
    )
  }

  if (topPerformers.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6"
    >
      {topPerformers.map((crypto, index) => (
        <EnhancedCryptoPerformerCard
          key={crypto.id}
          crypto={crypto}
          rank={index + 1}
          index={index}
        />
      ))}
    </motion.div>
  )
}

