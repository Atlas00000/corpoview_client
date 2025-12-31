'use client'

import { motion } from 'framer-motion'
import { MarketStatusData } from './MarketStatus'
import { IconTrendingUp, IconArrowRight, IconClock } from '@/components/icons'

export interface MarketSessionInfoProps {
  marketData: MarketStatusData
  variant: 'open' | 'closed' | 'extended'
}

export default function MarketSessionInfo({ marketData, variant }: MarketSessionInfoProps) {
  if (variant === 'open') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-white/90">
          <IconTrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Regular Trading Hours</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Session Type</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">Regular Hours</span>
          </div>
          <div className="p-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Trading Volume</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">High Activity</span>
          </div>
          <div className="p-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Liquidity</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">Optimal</span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'extended') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-white/90">
          <IconClock className="w-4 h-4" />
          <span className="text-sm font-medium">Extended Hours Trading</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Session Type</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">
              {marketData.status === 'pre-market' ? 'Pre-Market' : 'After-Hours'}
            </span>
          </div>
          <div className="p-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Trading Volume</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">Lower Activity</span>
          </div>
          <div className="p-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Liquidity</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">Reduced</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-700 dark:text-white/90">
        <IconArrowRight className="w-4 h-4" />
        <span className="text-sm font-medium">Next Trading Session</span>
      </div>
      <div className="p-4 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">Opens</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              {marketData.nextMarketOpen.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-600 dark:text-white/70 text-xs block mb-1">At</span>
            <span className="text-slate-900 dark:text-white font-semibold font-mono">
              {marketData.nextMarketOpen.toLocaleTimeString('en-US', {
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

