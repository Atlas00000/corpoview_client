'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { scaleIn } from '@/lib/animations/variants'

export interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  children: ReactNode
  delay?: number
  duration?: number
  scale?: number
}

export default function ScaleIn({
  children,
  delay = 0,
  duration = 0.2,
  scale = 0.95,
  className = '',
  ...props
}: ScaleInProps) {
  const customVariants = {
    hidden: {
      opacity: 0,
      scale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale,
      transition: {
        duration: duration * 0.75,
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

