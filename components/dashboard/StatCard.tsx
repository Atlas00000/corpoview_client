'use client'

import { ReactNode, useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import Card from '@/components/ui/Card'
import { SlideUp } from '@/components/effects'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'glass' | 'elevated'
  animateValue?: boolean
  className?: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  animateValue = true,
  className = '',
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const isNumber = typeof value === 'number'

  // Animated number counting
  useEffect(() => {
    if (isNumber && animateValue) {
      const duration = 1000
      const steps = 60
      const increment = value / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        step++
        current = Math.min(increment * step, value)
        setDisplayValue(current)

        if (step >= steps) {
          clearInterval(timer)
          setDisplayValue(value)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setDisplayValue(value as number)
    }
  }, [value, isNumber, animateValue])

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`
      if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`
      if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`
      if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`
      return val.toLocaleString()
    }
    return val
  }

  return (
    <SlideUp>
      <Card variant={variant} hover className={`p-4 sm:p-6 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate"
            >
              {title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 truncate"
            >
              {isNumber && animateValue ? formatValue(displayValue) : formatValue(value)}
            </motion.p>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 text-sm text-slate-500 dark:text-slate-400"
              >
                {subtitle}
              </motion.p>
            )}

            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 flex items-center gap-1.5"
              >
                <span
                  className={`text-sm font-semibold flex items-center gap-1 ${
                    trend.isPositive
                      ? 'text-success-600 dark:text-success-500'
                      : 'text-danger-600 dark:text-danger-500'
                  }`}
                >
                  <motion.span
                    animate={{ rotate: trend.isPositive ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {trend.isPositive ? '↑' : '↓'}
                  </motion.span>
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  vs previous
                </span>
              </motion.div>
            )}
          </div>

          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="ml-4 flex-shrink-0 text-primary-500 dark:text-primary-400"
            >
              {icon}
            </motion.div>
          )}
        </div>
      </Card>
    </SlideUp>
  )
}

