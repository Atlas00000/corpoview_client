'use client'

import { useState } from 'react'

export type AssetType = 'all' | 'stocks' | 'crypto' | 'fx'

interface FilterBarProps {
  selectedAssetType?: AssetType
  onAssetTypeChange?: (type: AssetType) => void
  className?: string
}

export default function FilterBar({
  selectedAssetType = 'all',
  onAssetTypeChange,
  className = '',
}: FilterBarProps) {
  const assetTypes: { value: AssetType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'fx', label: 'FX' },
  ]

  const handleClick = (type: AssetType) => {
    if (onAssetTypeChange) {
      onAssetTypeChange(type)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {assetTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => handleClick(type.value)}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation min-h-[44px] min-w-[44px] ${
            selectedAssetType === type.value
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}

