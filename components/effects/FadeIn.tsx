'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { fadeIn } from '@/lib/animations/variants'

export interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  children: ReactNode
  delay?: number
  duration?: number
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.2,
  className = '',
  ...props
}: FadeInProps) {
  const customVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
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

