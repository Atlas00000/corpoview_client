'use client'

import { useState } from 'react'
import { Container, Section } from '@/components/layout'
import { FadeIn } from '@/components/effects'
import StockComparison from './StockComparison'
import CryptoComparison from './CryptoComparison'
import FXComparison from './FXComparison'
import PortfolioView, { PortfolioAsset } from './PortfolioView'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'
import { IconX } from '@/components/icons'

export interface MultiAssetComparisonPageProps {
  initialType?: 'stocks' | 'crypto' | 'fx' | 'portfolio'
}

const tabs = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Cryptocurrency' },
  { id: 'fx', label: 'FX Pairs' },
  { id: 'portfolio', label: 'Portfolio' },
] as const

const DEFAULT_STOCKS = ['AAPL', 'MSFT', 'GOOGL']
const DEFAULT_CRYPTO = ['bitcoin', 'ethereum', 'binancecoin']
const DEFAULT_FX = ['EUR/USD', 'GBP/USD', 'USD/JPY']

export default function MultiAssetComparisonPage({ initialType = 'stocks' }: MultiAssetComparisonPageProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>(initialType)
  const [stockSymbols, setStockSymbols] = useState<string[]>(DEFAULT_STOCKS)
  const [cryptoIds, setCryptoIds] = useState<string[]>(DEFAULT_CRYPTO)
  const [fxPairs, setFxPairs] = useState<string[]>(DEFAULT_FX)
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([
    { type: 'stock', symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
    { type: 'stock', symbol: 'MSFT', quantity: 5, purchasePrice: 300 },
    { type: 'crypto', symbol: 'bitcoin', quantity: 0.1, purchasePrice: 50000 },
  ])

  const [newStockSymbol, setNewStockSymbol] = useState('')
  const [newCryptoId, setNewCryptoId] = useState('')
  const [newFxPair, setNewFxPair] = useState('')
  const [newPortfolioAsset, setNewPortfolioAsset] = useState({
    type: 'stock' as 'stock' | 'crypto' | 'fx',
    symbol: '',
    quantity: 0,
  })

  const handleAddStock = () => {
    if (newStockSymbol && !stockSymbols.includes(newStockSymbol.toUpperCase())) {
      setStockSymbols([...stockSymbols, newStockSymbol.toUpperCase()])
      setNewStockSymbol('')
    }
  }

  const handleRemoveStock = (symbol: string) => {
    setStockSymbols(stockSymbols.filter((s) => s !== symbol))
  }

  const handleAddCrypto = () => {
    if (newCryptoId && !cryptoIds.includes(newCryptoId.toLowerCase())) {
      setCryptoIds([...cryptoIds, newCryptoId.toLowerCase()])
      setNewCryptoId('')
    }
  }

  const handleRemoveCrypto = (id: string) => {
    setCryptoIds(cryptoIds.filter((c) => c !== id))
  }

  const handleAddFx = () => {
    if (newFxPair && !fxPairs.includes(newFxPair.toUpperCase())) {
      setFxPairs([...fxPairs, newFxPair.toUpperCase()])
      setNewFxPair('')
    }
  }

  const handleRemoveFx = (pair: string) => {
    setFxPairs(fxPairs.filter((p) => p !== pair))
  }

  const handleAddPortfolioAsset = () => {
    if (newPortfolioAsset.symbol && newPortfolioAsset.quantity > 0) {
      setPortfolioAssets([
        ...portfolioAssets,
        {
          ...newPortfolioAsset,
          symbol:
            newPortfolioAsset.type === 'crypto'
              ? newPortfolioAsset.symbol.toLowerCase()
              : newPortfolioAsset.symbol.toUpperCase(),
        },
      ])
      setNewPortfolioAsset({ type: 'stock', symbol: '', quantity: 0 })
    }
  }

  const handleRemovePortfolioAsset = (index: number) => {
    setPortfolioAssets(portfolioAssets.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Section spacing="lg">
        <Container>
          <div className="space-y-8">
            <FadeIn>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Multi-Asset Comparison Mode
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-3xl">
                  Analyze multiple assets simultaneously with powerful comparison tools. Compare stocks, cryptocurrencies, and foreign exchange pairs side-by-side to identify opportunities, assess relative performance, and make informed investment decisions across asset classes.
                </p>
                <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Portfolio intelligence at your fingertips.</strong> Our comparison tools enable you to evaluate asset performance across different classes, understand correlation patterns, and optimize your portfolio allocation. Visualize normalized performance trends, track key metrics in real-time, and gain comprehensive insights into your investment universe.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-6 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-600 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </FadeIn>

            {activeTab === 'stocks' && (
              <FadeIn delay={0.15}>
                <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      type="text"
                      value={newStockSymbol}
                      onChange={(e) => setNewStockSymbol(e.target.value)}
                      placeholder="Enter stock symbol (e.g., AAPL)"
                      className="flex-1"
                      id="new-stock-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
                    />
                    <Button onClick={handleAddStock} variant="primary">
                      Add Stock
                    </Button>
                  </div>
                  {stockSymbols.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {stockSymbols.map((symbol) => (
                        <span
                          key={symbol}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                        >
                          {symbol}
                          <button
                            onClick={() => handleRemoveStock(symbol)}
                            className="hover:text-primary-900 dark:hover:text-primary-100"
                          >
                            <IconX size={16} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <StockComparison symbols={stockSymbols} />
              </FadeIn>
            )}

            {activeTab === 'crypto' && (
              <FadeIn delay={0.15}>
                <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      type="text"
                      value={newCryptoId}
                      onChange={(e) => setNewCryptoId(e.target.value)}
                      placeholder="Enter crypto ID (e.g., bitcoin)"
                      className="flex-1"
                      id="new-crypto-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCrypto()}
                    />
                    <Button onClick={handleAddCrypto} variant="primary">
                      Add Crypto
                    </Button>
                  </div>
                  {cryptoIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cryptoIds.map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-lg"
                        >
                          {id}
                          <button
                            onClick={() => handleRemoveCrypto(id)}
                            className="hover:text-success-900 dark:hover:text-success-100"
                          >
                            <IconX size={16} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <CryptoComparison cryptoIds={cryptoIds} />
              </FadeIn>
            )}

            {activeTab === 'fx' && (
              <FadeIn delay={0.15}>
                <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      type="text"
                      value={newFxPair}
                      onChange={(e) => setNewFxPair(e.target.value)}
                      placeholder="Enter FX pair (e.g., EUR/USD)"
                      className="flex-1"
                      id="new-fx-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFx()}
                    />
                    <Button onClick={handleAddFx} variant="primary">
                      Add Pair
                    </Button>
                  </div>
                  {fxPairs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {fxPairs.map((pair) => (
                        <span
                          key={pair}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg"
                        >
                          {pair}
                          <button
                            onClick={() => handleRemoveFx(pair)}
                            className="hover:text-purple-900 dark:hover:text-purple-100"
                          >
                            <IconX size={16} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <FXComparison pairs={fxPairs} />
              </FadeIn>
            )}

            {activeTab === 'portfolio' && (
              <FadeIn delay={0.15}>
                <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                    <select
                      value={newPortfolioAsset.type}
                      onChange={(e) =>
                        setNewPortfolioAsset({
                          ...newPortfolioAsset,
                          type: e.target.value as 'stock' | 'crypto' | 'fx',
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="stock">Stock</option>
                      <option value="crypto">Crypto</option>
                      <option value="fx">FX</option>
                    </select>
                    <Input
                      type="text"
                      value={newPortfolioAsset.symbol}
                      onChange={(e) =>
                        setNewPortfolioAsset({ ...newPortfolioAsset, symbol: e.target.value })
                      }
                      placeholder="Symbol"
                      id="portfolio-symbol-input"
                    />
                    <Input
                      type="number"
                      value={newPortfolioAsset.quantity || ''}
                      onChange={(e) =>
                        setNewPortfolioAsset({
                          ...newPortfolioAsset,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Quantity"
                      id="portfolio-quantity-input"
                    />
                    <Button onClick={handleAddPortfolioAsset} variant="primary">
                      Add Asset
                    </Button>
                  </div>
                </div>
                <PortfolioView assets={portfolioAssets} />
              </FadeIn>
            )}
          </div>
        </Container>
      </Section>
    </div>
  )
}

