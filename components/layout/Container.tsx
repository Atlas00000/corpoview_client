'use client'

import { ReactNode, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/effects'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'wide' | 'full'
  animate?: boolean
}

export function Container({
  children,
  size = 'xl',
  animate = true,
  className = '',
  ...props
}: ContainerProps) {
  const sizeStyles = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[90rem]',
    wide: 'max-w-[95%] 2xl:max-w-[1600px]',
    full: 'max-w-full',
  }

  const containerClass = `mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 ${sizeStyles[size]} ${className}`

  if (animate) {
    return (
      <FadeIn className={containerClass} {...(props as any)}>
        {children}
      </FadeIn>
    )
  }

  return (
    <div className={containerClass} {...props}>
      {children}
    </div>
  )
}

// Section component for content sections
export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
}

export function Section({
  children,
  spacing = 'lg',
  animate = true,
  className = '',
  ...props
}: SectionProps) {
  const spacingStyles = {
    none: '',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8',
    lg: 'py-8 sm:py-12',
    xl: 'py-12 sm:py-16',
  }

  const sectionClass = `${spacingStyles[spacing]} ${className}`

  if (animate) {
    const { onAnimationStart, ...motionProps } = props
    return (
      <motion.section
        className={sectionClass}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...(motionProps as any)}
      >
        {children}
      </motion.section>
    )
  }

  return (
    <section className={sectionClass} {...props}>
      {children}
    </section>
  )
}

// Grid container component
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

export function Grid({
  children,
  cols = 3,
  gap = 'md',
  responsive = true,
  className = '',
  ...props
}: GridProps) {
  const gapStyles = {
    sm: 'gap-2 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12',
  }

  const gridCols = responsive
    ? {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
        12: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12',
      }
    : {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      }

  return (
    <div
      className={`grid ${gridCols[cols]} ${gapStyles[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

