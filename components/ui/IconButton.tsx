'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { tapScale, hoverLift } from '@/lib/animations/variants'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  variant?: 'default' | 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  ariaLabel: string
  className?: string
}

export default function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  ariaLabel,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const variantStyles = {
    default:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 focus:ring-slate-500',
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-500',
    danger:
      'bg-danger-100 text-danger-700 hover:bg-danger-200 dark:bg-danger-900/30 dark:text-danger-400 dark:hover:bg-danger-900/50 focus:ring-danger-500',
  }

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  const { onAnimationStart, ...motionProps } = props
  
  return (
    <motion.button
      className={combinedClassName}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={!disabled ? hoverLift : {}}
      whileTap={!disabled ? tapScale : {}}
      {...(motionProps as any)}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </motion.button>
  )
}

