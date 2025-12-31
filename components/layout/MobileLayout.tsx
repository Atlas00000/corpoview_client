'use client'

import { ReactNode } from 'react'

export interface MobileLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * Mobile-optimized layout wrapper
 * Provides mobile-specific optimizations including:
 * - Touch-friendly spacing
 * - Optimized padding for small screens
 * - Better scroll behavior
 * - Mobile viewport considerations
 */
export default function MobileLayout({ children, className = '' }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen w-full ${className}`}>
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}

/**
 * Mobile-optimized container with responsive padding
 */
export function MobileContainer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Mobile-optimized section spacing
 */
export function MobileSection({
  children,
  spacing = 'md',
  className = '',
}: {
  children: ReactNode
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const spacingStyles = {
    xs: 'py-3 sm:py-4',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8 md:py-10',
    lg: 'py-8 sm:py-12 md:py-16',
    xl: 'py-12 sm:py-16 md:py-20',
  }

  return (
    <section className={`${spacingStyles[spacing]} ${className}`}>
      {children}
    </section>
  )
}

