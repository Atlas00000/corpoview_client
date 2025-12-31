'use client'

import { useState, ReactNode } from 'react'

export interface ComparisonAsset {
  id: string
  name: string
  symbol: string
  type: 'stock' | 'crypto' | 'fx'
  color?: string
}

export interface ComparisonModeProps {
  assets: ComparisonAsset[]
  onAssetsChange: (assets: ComparisonAsset[]) => void
  children: ReactNode
  maxAssets?: number
  className?: string
}

export default function ComparisonMode({
  assets,
  onAssetsChange,
  children,
  maxAssets = 5,
  className = '',
}: ComparisonModeProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleRemoveAsset = (id: string) => {
    onAssetsChange(assets.filter((asset) => asset.id !== id))
  }

  const handleAddAsset = (asset: ComparisonAsset) => {
    if (assets.length >= maxAssets) {
      alert(`Maximum ${maxAssets} assets can be compared`)
      return
    }

    if (assets.some((a) => a.id === asset.id)) {
      alert('Asset already added to comparison')
      return
    }

    onAssetsChange([...assets, asset])
    setSearchQuery('')
    setIsAdding(false)
  }

  const defaultColors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ]

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Compare Assets
          </h3>
          {assets.length < maxAssets && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              {isAdding ? 'Cancel' : '+ Add Asset'}
            </button>
          )}
        </div>

        {isAdding && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for asset (e.g., AAPL, BTC, EUR/USD)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Search functionality will be connected to API in future updates
            </p>
          </div>
        )}

        {assets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {assets.map((asset, index) => (
              <div
                key={asset.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
                style={{
                  borderLeftColor: asset.color || defaultColors[index % defaultColors.length],
                  borderLeftWidth: '4px',
                }}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {asset.symbol}
                </span>
                <button
                  onClick={() => handleRemoveAsset(asset.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label={`Remove ${asset.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {assets.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No assets selected for comparison. Click "Add Asset" to get started.
          </p>
        )}
      </div>

      {assets.length > 0 && <div>{children}</div>}
    </div>
  )
}

