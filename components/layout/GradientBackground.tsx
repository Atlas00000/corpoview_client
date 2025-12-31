'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface GradientBackgroundProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'danger' | 'neutral' | 'custom'
  animated?: boolean
  className?: string
}

export default function GradientBackground({
  children,
  variant = 'primary',
  animated = true,
  className = '',
}: GradientBackgroundProps) {
  const gradientVariants = {
    primary: 'from-primary-600 via-primary-500 to-secondary-500',
    success: 'from-success-500 to-success-600',
    danger: 'from-danger-500 to-danger-600',
    neutral: 'from-slate-800 to-slate-900',
    custom: '',
  }

  const gradientClass = variant !== 'custom' ? gradientVariants[variant] : ''

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {animated ? (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Animated gradient mesh background
export function GradientMesh({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary-600/20 to-secondary-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

// Subtle gradient overlay
export function GradientOverlay({
  variant = 'primary',
  intensity = 'light',
  className = '',
}: {
  variant?: 'primary' | 'success' | 'danger' | 'neutral'
  intensity?: 'light' | 'medium' | 'strong'
  className?: string
}) {
  const intensityClasses = {
    light: 'opacity-10',
    medium: 'opacity-20',
    strong: 'opacity-30',
  }

  const gradientVariants = {
    primary: 'from-primary-500 to-secondary-500',
    success: 'from-success-500 to-success-600',
    danger: 'from-danger-500 to-danger-600',
    neutral: 'from-slate-700 to-slate-800',
  }

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradientVariants[variant]} ${intensityClasses[intensity]} pointer-events-none ${className}`}
    />
  )
}

