'use client'

import { motion } from 'framer-motion'
import { IconChartBar, IconActivity, IconTrendingUp } from '@/components/icons'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
}

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const rotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/30 dark:from-slate-950 dark:via-primary-950/30 dark:to-secondary-950/30 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center"
      >
        {/* Logo/Brand */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="relative inline-block"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              CorpoView
            </h1>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-secondary-600/20 rounded-full blur-2xl"
              variants={pulseVariants}
              animate="animate"
            />
          </motion.div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Corporate Intelligence Dashboard
          </p>
        </motion.div>

        {/* Animated icons */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center gap-8">
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm border border-primary-500/30 flex items-center justify-center">
              <IconChartBar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </motion.div>

          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center">
              <IconActivity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 backdrop-blur-sm border border-secondary-500/30 flex items-center justify-center">
              <IconTrendingUp className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Loading indicator */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Loading market data...
          </p>
        </motion.div>

        {/* Rotating ring decoration */}
        <motion.div
          className="absolute inset-0 -z-10 flex items-center justify-center"
          variants={rotateVariants}
          animate="animate"
        >
          <div className="w-96 h-96 rounded-full border-2 border-dashed border-primary-500/20 dark:border-primary-400/20" />
        </motion.div>
        <motion.div
          className="absolute inset-0 -z-10 flex items-center justify-center"
          variants={rotateVariants}
          animate="animate"
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-80 h-80 rounded-full border-2 border-dashed border-secondary-500/20 dark:border-secondary-400/20" />
        </motion.div>
      </motion.div>
    </div>
  )
}

