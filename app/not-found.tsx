'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconAlertCircle, IconChartBar, IconActivity, IconTrendingUp, IconArrowRight, IconHome } from '@/components/icons'

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

const floatVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const quickLinks = [
  { name: 'Dashboard', href: '/', icon: IconHome },
  { name: 'Stocks', href: '/stocks', icon: IconChartBar },
  { name: 'Crypto', href: '/crypto', icon: IconTrendingUp },
  { name: 'News', href: '/news', icon: IconActivity },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/30 dark:from-slate-950 dark:via-primary-950/30 dark:to-secondary-950/30 flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10"
            style={{
              width: Math.random() * 150 + 100,
              height: Math.random() * 150 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl w-full text-center"
      >
        {/* 404 Number */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="relative inline-block"
            variants={floatVariants}
            animate="animate"
          >
            <h1 className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent leading-none mb-4">
              404
            </h1>
            <motion.div
              className="absolute -inset-8 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-secondary-600/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Error message */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconAlertCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Page Not Found
            </h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, let's get you back on track with our market intelligence dashboard.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <IconHome className="w-5 h-5" />
              Back to Dashboard
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:scale-105"
          >
            Go Back
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div variants={itemVariants}>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
            Quick Links
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={link.href}
                    className="block p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg group"
                  >
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {link.name}
                    </p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <IconChartBar className="w-32 h-32 text-primary-500" />
          </motion.div>
        </div>

        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <IconTrendingUp className="w-32 h-32 text-secondary-500" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

