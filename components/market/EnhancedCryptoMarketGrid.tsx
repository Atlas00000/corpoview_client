'use client'

import { motion } from 'framer-motion'
import EnhancedCryptoCard from './EnhancedCryptoCard'
import { useGlobalCryptoData } from '@/lib/hooks/useCryptoData'
import { SlideUp } from '@/components/effects'

const TOP_CRYPTOS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'ripple',
  'polkadot',
  'dogecoin',
]

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

export default function EnhancedCryptoMarketGrid() {
  const { global, isLoading: globalLoading } = useGlobalCryptoData()

  return (
    <div className="space-y-6">
      {global && (
        <SlideUp delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-3xl bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 dark:from-primary-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Total Market Cap
                  </p>
                  <motion.p
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {formatLargeNumber(global.totalMarketCap)}
                  </motion.p>
                  {global.marketCapChangePercentage24hUsd !== undefined && (
                    <p className={`text-xs font-semibold mt-1 ${
                      global.marketCapChangePercentage24hUsd >= 0
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-danger-600 dark:text-danger-400'
                    }`}>
                      {global.marketCapChangePercentage24hUsd >= 0 ? '+' : ''}
                      {global.marketCapChangePercentage24hUsd.toFixed(2)}% 24h
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    24h Volume
                  </p>
                  <motion.p
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {formatLargeNumber(global.totalVolume)}
                  </motion.p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Active Cryptocurrencies
                  </p>
                  <motion.p
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {global.activeCryptocurrencies.toLocaleString()}
                  </motion.p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Markets
                  </p>
                  <motion.p
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {global.markets.toLocaleString()}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </SlideUp>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      >
        {TOP_CRYPTOS.map((cryptoId, index) => (
          <EnhancedCryptoCard
            key={cryptoId}
            cryptoId={cryptoId}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  )
}

