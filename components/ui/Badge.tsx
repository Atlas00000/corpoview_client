'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const variantStyles = {
    default:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary:
      'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    success:
      'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    danger:
      'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
    warning:
      'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    secondary:
      'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400',
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-75"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {children}
    </motion.span>
  )
}

