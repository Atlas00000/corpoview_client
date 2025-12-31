'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations/variants'

export interface StaggerContainerProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  children: ReactNode
  staggerDelay?: number
  childDelay?: number
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.05,
  childDelay = 0.1,
  className = '',
  ...props
}: StaggerContainerProps) {
  const customVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// StaggerItem component to be used with StaggerContainer
export interface StaggerItemProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  children: ReactNode
  delay?: number
  duration?: number
}

export function StaggerItem({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  ...props
}: StaggerItemProps) {
  const customVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div variants={customVariants} className={className} {...props}>
      {children}
    </motion.div>
  )
}

