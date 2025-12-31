'use client'

import { motion } from 'framer-motion'

export interface TrendIndicatorProps {
  value: number
  isPositive: boolean
  label?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function TrendIndicator({
  value,
  isPositive,
  label,
  showIcon = true,
  size = 'md',
  className = '',
}: TrendIndicatorProps) {
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const colorClass = isPositive
    ? 'text-success-600 dark:text-success-500'
    : 'text-danger-600 dark:text-danger-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {showIcon && (
        <motion.svg
          className={`${iconSize[size]} ${colorClass}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isPositive ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </motion.svg>
      )}

      <span className={`font-semibold ${sizeStyles[size]} ${colorClass}`}>
        {Math.abs(value).toFixed(2)}%
      </span>

      {label && (
        <span className={`${sizeStyles[size]} text-slate-500 dark:text-slate-400`}>
          {label}
        </span>
      )}
    </motion.div>
  )
}

// Trend Badge variant - compact version
export function TrendBadge({
  value,
  isPositive,
  className = '',
}: Omit<TrendIndicatorProps, 'label' | 'showIcon' | 'size'>) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
        isPositive
          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
          : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
      } ${className}`}
    >
      <motion.span
        animate={{ rotate: isPositive ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isPositive ? '↑' : '↓'}
      </motion.span>
      {Math.abs(value).toFixed(1)}%
    </motion.span>
  )
}

