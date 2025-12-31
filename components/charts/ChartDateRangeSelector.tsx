'use client'

import { motion } from 'framer-motion'

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all'

export interface ChartDateRangeSelectorProps {
  selectedRange: TimeRange
  onRangeChange: (range: TimeRange) => void
  options?: TimeRange[]
  className?: string
}

const DEFAULT_OPTIONS: TimeRange[] = ['7d', '30d', '90d', '1y']

export default function ChartDateRangeSelector({
  selectedRange,
  onRangeChange,
  options = DEFAULT_OPTIONS,
  className = '',
}: ChartDateRangeSelectorProps) {
  const rangeLabels: Record<TimeRange, string> = {
    '7d': '7 Days',
    '30d': '30 Days',
    '90d': '90 Days',
    '1y': '1 Year',
    all: 'All Time',
  }

  return (
    <div className={`inline-flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`}>
      {options.map((range) => {
        const isSelected = selectedRange === range
        return (
          <motion.button
            key={range}
            onClick={() => onRangeChange(range)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isSelected
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSelected && (
              <motion.div
                layoutId="activeRange"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{rangeLabels[range]}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

