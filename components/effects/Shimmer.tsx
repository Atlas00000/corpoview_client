'use client'

import { HTMLAttributes } from 'react'

export interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export default function Shimmer({ className = '', ...props }: ShimmerProps) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        }}
      />
    </div>
  )
}

