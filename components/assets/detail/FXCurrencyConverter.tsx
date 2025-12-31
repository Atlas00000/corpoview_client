'use client'

import { useState, useMemo } from 'react'
import { useCurrencyConversion, useLatestRates } from '@/lib/hooks/useFXData'
import { motion } from 'framer-motion'
import { SlideUp, Skeleton } from '@/components/effects'
import { Card } from '@/components/ui'
import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'

export interface FXCurrencyConverterProps {
  from: string
  to: string
}

export default function FXCurrencyConverter({ from, to }: FXCurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('100')
  const [swapCurrencies, setSwapCurrencies] = useState(false)
  
  const currentFrom = swapCurrencies ? to : from
  const currentTo = swapCurrencies ? from : to
  
  const numericAmount = parseFloat(amount) || 0
  const { conversion, isLoading } = useCurrencyConversion(
    numericAmount > 0 ? numericAmount : null,
    currentFrom,
    currentTo
  )

  const handleSwap = () => {
    setSwapCurrencies(!swapCurrencies)
  }

  return (
    <SlideUp>
      <Card variant="elevated" hover={false} className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Currency Converter
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amount ({currentFrom})
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Converted ({currentTo})
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={
                    isLoading
                      ? 'Calculating...'
                      : conversion
                      ? conversion.converted.toFixed(4)
                      : '0.00'
                  }
                  readOnly
                  className="w-full bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={handleSwap}
              className="rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Swap Currencies
            </Button>
          </div>

          {conversion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Exchange Rate
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    1 {currentFrom} = {conversion.rate.toFixed(4)} {currentTo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(conversion.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </SlideUp>
  )
}

