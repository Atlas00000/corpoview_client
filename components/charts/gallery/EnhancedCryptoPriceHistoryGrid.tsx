'use client'

import { motion } from 'framer-motion'
import EnhancedCryptoPriceHistoryCard from './EnhancedCryptoPriceHistoryCard'
import { SlideUp } from '@/components/effects'

const TOP_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
]

export default function EnhancedCryptoPriceHistoryGrid() {
  return (
    <div className="space-y-6">
      <SlideUp delay={0.1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Cryptocurrency Price History
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Interactive price charts with multiple time ranges, zoom, pan, and detailed statistics
            </p>
          </div>
        </motion.div>
      </SlideUp>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {TOP_CRYPTOS.map((crypto, index) => (
          <EnhancedCryptoPriceHistoryCard
            key={crypto.id}
            cryptoId={crypto.id}
            symbol={crypto.symbol}
            name={crypto.name}
            defaultRange={index % 2 === 0 ? '30d' : '90d'}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  )
}

