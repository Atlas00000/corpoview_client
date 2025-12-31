'use client'

import { useState, ReactNode } from 'react'

export interface ChartDrillDownProps {
  overviewContent: ReactNode
  detailContent: ReactNode
  showBackButton?: boolean
  onBack?: () => void
  className?: string
}

export default function ChartDrillDown({
  overviewContent,
  detailContent,
  showBackButton = true,
  onBack,
  className = '',
}: ChartDrillDownProps) {
  const [isDrilledDown, setIsDrilledDown] = useState(false)

  const handleDrillDown = () => {
    setIsDrilledDown(true)
  }

  const handleBack = () => {
    setIsDrilledDown(false)
    if (onBack) {
      onBack()
    }
  }

  return (
    <div className={className}>
      {isDrilledDown ? (
        <div>
          {showBackButton && (
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Overview
            </button>
          )}
          {detailContent}
        </div>
      ) : (
        <div onClick={handleDrillDown} className="cursor-pointer">
          {overviewContent}
        </div>
      )}
    </div>
  )
}

