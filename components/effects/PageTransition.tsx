'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { pageTransition } from '@/lib/animations/variants'

export interface PageTransitionProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  children: ReactNode
  className?: string
}

export default function PageTransition({
  children,
  className = '',
  ...props
}: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

