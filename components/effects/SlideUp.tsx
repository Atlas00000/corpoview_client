'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { slideUp } from '@/lib/animations/variants'

export interface SlideUpProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
}

export default function SlideUp({
  children,
  delay = 0,
  duration = 0.3,
  distance = 10,
  className = '',
  ...props
}: SlideUpProps) {
  const customVariants = {
    hidden: {
      opacity: 0,
      y: distance,
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
    exit: {
      opacity: 0,
      y: distance,
      transition: {
        duration: duration * 0.67,
        ease: 'easeIn',
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={customVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

