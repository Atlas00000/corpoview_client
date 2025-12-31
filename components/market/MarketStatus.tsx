'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MarketClock from './MarketClock'
import MarketSessionInfo from './MarketSessionInfo'
import { SlideUp } from '@/components/effects'
import { IconBuilding2, IconTrendingUp, IconTrendingDown, IconClock } from '@/components/icons'

export type MarketStatus = 'open' | 'closed' | 'pre-market' | 'after-hours'

export interface MarketStatusData {
  status: MarketStatus
  currentTime: Date
  marketOpenTime: Date
  marketCloseTime: Date
  nextMarketOpen: Date
  timeUntilOpen?: number
  timeUntilClose?: number
}

function getETTimeComponents(now: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  })
  
  const parts = formatter.formatToParts(now)
  return {
    hour: parseInt(parts.find(p => p.type === 'hour')?.value || '0'),
    minute: parseInt(parts.find(p => p.type === 'minute')?.value || '0'),
    weekday: parts.find(p => p.type === 'weekday')?.value || '',
  }
}

function getMarketStatus(): MarketStatusData {
  const now = new Date()
  const currentTime = new Date(now)
  
  const etComponents = getETTimeComponents(now)
  const hours = etComponents.hour
  const minutes = etComponents.minute
  const weekday = etComponents.weekday
  
  const isWeekend = weekday === 'Sat' || weekday === 'Sun'
  const currentMinutes = hours * 60 + minutes
  const marketOpenMinutes = 9 * 60 + 30
  const marketCloseMinutes = 16 * 60

  const createMarketTime = (targetHours: number, targetMinutes: number, daysOffset: number = 0): Date => {
    const today = new Date(now)
    today.setHours(targetHours, targetMinutes, 0, 0)
    if (daysOffset !== 0) {
      today.setDate(today.getDate() + daysOffset)
    }
    return today
  }

  const getMarketOpenTime = (daysOffset: number = 0) => createMarketTime(9, 30, daysOffset)
  const getMarketCloseTime = (daysOffset: number = 0) => createMarketTime(16, 0, daysOffset)

  let status: MarketStatus = 'closed'
  let timeUntilOpen: number | undefined
  let timeUntilClose: number | undefined
  let nextMarketOpen: Date
  let marketOpenTime: Date
  let marketCloseTime: Date

  if (isWeekend) {
    status = 'closed'
    const daysToMonday = weekday === 'Sat' ? 2 : 1
    marketOpenTime = getMarketOpenTime(0)
    marketCloseTime = getMarketCloseTime(0)
    nextMarketOpen = getMarketOpenTime(daysToMonday)
    timeUntilOpen = Math.max(0, nextMarketOpen.getTime() - now.getTime())
  } else if (currentMinutes < 4 * 60) {
    status = 'closed'
    marketOpenTime = getMarketOpenTime(0)
    marketCloseTime = getMarketCloseTime(0)
    nextMarketOpen = getMarketOpenTime(0)
    if (nextMarketOpen.getTime() <= now.getTime()) {
      nextMarketOpen = getMarketOpenTime(1)
    }
    timeUntilOpen = Math.max(0, nextMarketOpen.getTime() - now.getTime())
  } else if (currentMinutes >= 4 * 60 && currentMinutes < marketOpenMinutes) {
    status = 'pre-market'
    marketOpenTime = getMarketOpenTime(0)
    marketCloseTime = getMarketCloseTime(0)
    nextMarketOpen = marketOpenTime
    timeUntilOpen = Math.max(0, marketOpenTime.getTime() - now.getTime())
  } else if (currentMinutes >= marketOpenMinutes && currentMinutes < marketCloseMinutes) {
    status = 'open'
    marketOpenTime = getMarketOpenTime(0)
    marketCloseTime = getMarketCloseTime(0)
    nextMarketOpen = getMarketOpenTime(1)
    timeUntilClose = Math.max(0, marketCloseTime.getTime() - now.getTime())
  } else if (currentMinutes >= marketCloseMinutes && currentMinutes < 20 * 60) {
    status = 'after-hours'
    marketOpenTime = getMarketOpenTime(0)
    marketCloseTime = getMarketCloseTime(0)
    nextMarketOpen = getMarketOpenTime(1)
    timeUntilOpen = Math.max(0, nextMarketOpen.getTime() - now.getTime())
  } else {
    status = 'closed'
    marketOpenTime = getMarketOpenTime(0)
    marketCloseTime = getMarketCloseTime(0)
    nextMarketOpen = getMarketOpenTime(1)
    timeUntilOpen = Math.max(0, nextMarketOpen.getTime() - now.getTime())
  }

  return {
    status,
    currentTime,
    marketOpenTime,
    marketCloseTime,
    nextMarketOpen,
    timeUntilOpen: (timeUntilOpen ?? 0) > 0 ? timeUntilOpen : undefined,
    timeUntilClose: timeUntilClose && timeUntilClose > 0 ? timeUntilClose : undefined,
  }
}

export default function MarketStatus() {
  const [marketData, setMarketData] = useState<MarketStatusData>(getMarketStatus())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setMarketData(getMarketStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <SlideUp>
        <div className="p-6">
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </SlideUp>
    )
  }

  const statusConfig = {
    open: {
      gradient: 'from-success-50 via-emerald-50 to-success-100 dark:from-success-500/20 dark:via-emerald-500/20 dark:to-success-600/20',
      glow: '',
      icon: IconTrendingUp,
      label: 'Market Open',
      description: 'Trading is active',
    },
    'pre-market': {
      gradient: 'from-amber-50 via-orange-50 to-amber-100 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-amber-600/20',
      glow: '',
      icon: IconClock,
      label: 'Pre-Market',
      description: 'Extended hours trading',
    },
    'after-hours': {
      gradient: 'from-purple-50 via-indigo-50 to-purple-100 dark:from-purple-500/20 dark:via-indigo-500/20 dark:to-purple-600/20',
      glow: '',
      icon: IconBuilding2,
      label: 'After Hours',
      description: 'Extended hours trading',
    },
    closed: {
      gradient: 'from-slate-50 via-slate-100 to-slate-200 dark:from-slate-500/20 dark:via-slate-600/20 dark:to-slate-700/20',
      glow: '',
      icon: IconTrendingDown,
      label: 'Market Closed',
      description: 'Trading suspended',
    },
  }

  const config = statusConfig[marketData.status]
  const StatusIcon = config.icon

  return (
    <SlideUp>
      <div className={`relative bg-gradient-to-br ${config.gradient} ${config.glow} p-8 rounded-2xl`}>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex items-center gap-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="p-4 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl"
              >
                <StatusIcon className="w-10 h-10 text-slate-900 dark:text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{config.label}</h3>
                <p className="text-slate-700 dark:text-white/90 text-sm">{config.description}</p>
              </div>
            </motion.div>

            <div className="lg:col-span-2">
              <MarketClock marketData={marketData} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {marketData.status === 'open' && (
              <motion.div
                key="open"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 mt-6 pt-6 border-t border-white/20"
              >
                <MarketSessionInfo marketData={marketData} variant="open" />
              </motion.div>
            )}
            {marketData.status === 'closed' && (
              <motion.div
                key="closed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 mt-6 pt-6 border-t border-white/20"
              >
                <MarketSessionInfo marketData={marketData} variant="closed" />
              </motion.div>
            )}
            {(marketData.status === 'pre-market' || marketData.status === 'after-hours') && (
              <motion.div
                key="extended"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 mt-6 pt-6 border-t border-white/20"
              >
                <MarketSessionInfo marketData={marketData} variant="extended" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </SlideUp>
  )
}
