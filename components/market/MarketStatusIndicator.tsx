'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlideUp } from '@/components/effects'

function isMarketOpen(): boolean {
  const now = new Date()
  const easternTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/New_York' })
  )
  
  const day = easternTime.getDay()
  const hours = easternTime.getHours()
  const minutes = easternTime.getMinutes()
  
  if (day === 0 || day === 6) return false
  
  const marketOpen = 9 * 60 + 30
  const marketClose = 16 * 60
  const currentMinutes = hours * 60 + minutes
  
  return currentMinutes >= marketOpen && currentMinutes < marketClose
}

export default function MarketStatusIndicator() {
  const [isOpen, setIsOpen] = useState(isMarketOpen())
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen(isMarketOpen())
      setTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const easternTime = new Date(
    time.toLocaleString('en-US', { timeZone: 'America/New_York' })
  )
  const timeString = easternTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })

  return (
    <SlideUp>
      <motion.div
        className="relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 transition-all duration-300" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'open' : 'closed'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`w-3 h-3 rounded-full ${
                  isOpen
                    ? 'bg-success-500 shadow-lg shadow-success-500/50'
                    : 'bg-slate-400'
                }`}
              />
            </AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute inset-0 rounded-full bg-success-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Market Status
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isOpen ? 'Open' : 'Closed'}
            </p>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              ET Time
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {timeString}
            </p>
          </div>
        </div>
      </motion.div>
    </SlideUp>
  )
}

