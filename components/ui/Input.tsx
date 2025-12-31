'use client'

import { InputHTMLAttributes, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  helperText?: string
}

export default function Input({
  label,
  error,
  success = false,
  leftIcon,
  rightIcon,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const hasError = !!error
  const showSuccess = success && !hasError

  const baseStyles = 'w-full px-4 py-2.5 text-base bg-white dark:bg-slate-800 border rounded-lg transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none touch-manipulation'

  const stateStyles = hasError
    ? 'border-danger-500 focus:border-danger-600 focus:ring-2 focus:ring-danger-500/20'
    : showSuccess
    ? 'border-success-500 focus:border-success-600 focus:ring-2 focus:ring-success-500/20'
    : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20'

  const combinedInputClassName = `${baseStyles} ${stateStyles} ${leftIcon ? 'pl-10' : ''} ${rightIcon || showSuccess ? 'pr-10' : ''} ${className}`

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>
        )}

        <motion.input
          id={inputId}
          className={combinedInputClassName}
          animate={
            hasError
              ? {
                  x: [0, -4, 4, -4, 4, 0],
                  transition: { duration: 0.4 },
                }
              : {}
          }
          {...(props as any)}
        />

        {rightIcon && !showSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {rightIcon}
          </div>
        )}

        {showSuccess && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <svg
              className="w-5 h-5 text-success-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-sm text-danger-600 dark:text-danger-400"
          >
            {error}
          </motion.p>
        )}

        {helperText && !hasError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-sm text-slate-500 dark:text-slate-400"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

