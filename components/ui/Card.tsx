'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated'
  hover?: boolean
  children: ReactNode
}

export default function Card({
  variant = 'default',
  hover = true,
  children,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl border transition-all duration-200'

  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md',
    glass: 'glass-card dark:glass-card-dark',
    elevated: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg',
  }

  const hoverStyles = hover
    ? 'card-hover cursor-pointer'
    : ''

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`

  const { onAnimationStart, ...motionProps } = props
  
  return (
    <motion.div
      className={combinedClassName}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      {...(motionProps as any)}
    >
      {children}
    </motion.div>
  )
}

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-slate-200 dark:border-slate-700 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Body Component
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardBody({ children, className = '', ...props }: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-slate-200 dark:border-slate-700 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Title Component
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function CardTitle({ children, className = '', ...props }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 dark:text-slate-100 ${className}`} {...props}>
      {children}
    </h3>
  )
}

// Card Description Component
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-slate-600 dark:text-slate-400 ${className}`} {...props}>
      {children}
    </p>
  )
}

