'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Card, { CardHeader, CardBody, CardTitle, CardDescription } from '@/components/ui/Card'
import { SlideUp } from '@/components/effects'

export interface MetricData {
  label: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  progress?: number // 0-100
}

export interface MetricCardProps {
  title: string
  description?: string
  metrics: MetricData[]
  icon?: ReactNode
  variant?: 'default' | 'glass' | 'elevated'
  showProgress?: boolean
  className?: string
}

export default function MetricCard({
  title,
  description,
  metrics,
  icon,
  variant = 'default',
  showProgress = false,
  className = '',
}: MetricCardProps) {
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
      <Card variant={variant} hover className={className}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {icon && (
                  <span className="text-primary-500 dark:text-primary-400">{icon}</span>
                )}
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {metric.label}
                  </span>
                  {metric.change && (
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        metric.change.isPositive
                          ? 'text-success-600 dark:text-success-500'
                          : 'text-danger-600 dark:text-danger-500'
                      }`}
                    >
                      <span>{metric.change.isPositive ? '↑' : '↓'}</span>
                      {Math.abs(metric.change.value)}%
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatValue(metric.value)}
                  </span>
                </div>

                {showProgress && metric.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          metric.progress >= 70
                            ? 'bg-success-500'
                            : metric.progress >= 40
                            ? 'bg-primary-500'
                            : 'bg-warning-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </SlideUp>
  )
}

