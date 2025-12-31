'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MarketStatusData } from './MarketStatus'
import { IconClock } from '@/components/icons'

export interface MarketClockProps {
  marketData: MarketStatusData
}

function formatTimeUntil(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export default function MarketClock({ marketData }: MarketClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const currentETTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'America/New_York' }))

  const timeUntilOpen = marketData.timeUntilOpen
    ? formatTimeUntil(marketData.timeUntilOpen)
    : null
  const timeUntilClose = marketData.timeUntilClose
    ? formatTimeUntil(marketData.timeUntilClose)
    : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-white/90">
          <IconClock className="w-5 h-5" />
          <span className="text-sm font-medium">Eastern Time</span>
        </div>
        <motion.div
          key={currentETTime.getSeconds()}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1 }}
          className="text-2xl font-bold text-slate-900 dark:text-white font-mono"
        >
          {formatTime(currentTime)} ET
        </motion.div>
      </div>

      {marketData.status === 'open' && timeUntilClose && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-white/90 text-sm">Closes in</span>
            <motion.span
              key={timeUntilClose}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-slate-900 dark:text-white font-mono"
            >
              {timeUntilClose}
            </motion.span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-200 dark:bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-success-500 dark:bg-success-400 rounded-full"
              initial={{ width: '100%' }}
              animate={{
                width: `${(marketData.timeUntilClose! / (6.5 * 60 * 60 * 1000)) * 100}%`,
              }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}

      {(marketData.status === 'closed' || marketData.status === 'after-hours') && timeUntilOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-white/90 text-sm">Opens in</span>
            <motion.span
              key={timeUntilOpen}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-slate-900 dark:text-white font-mono"
            >
              {timeUntilOpen}
            </motion.span>
          </div>
        </motion.div>
      )}

      {marketData.status === 'pre-market' && timeUntilOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-white/90 text-sm">Regular session starts in</span>
            <motion.span
              key={timeUntilOpen}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-slate-900 dark:text-white font-mono"
            >
              {timeUntilOpen}
            </motion.span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-white/20">
        <div>
          <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Market Opens</span>
          <span className="text-slate-900 dark:text-white font-semibold font-mono text-sm">
            {marketData.marketOpenTime.toLocaleTimeString('en-US', {
              timeZone: 'America/New_York',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
        <div>
          <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Market Closes</span>
          <span className="text-slate-900 dark:text-white font-semibold font-mono text-sm">
            {marketData.marketCloseTime.toLocaleTimeString('en-US', {
              timeZone: 'America/New_York',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

