'use client'

import { useRef, ReactNode } from 'react'
import {
  exportSVGAsPNG,
  exportSVGAsSVG,
  getSVGElement,
  exportDataAsCSV,
  exportDataAsJSON,
} from '@/lib/charts/exportUtils'

export interface ExportButtonProps {
  containerRef: React.RefObject<HTMLElement>
  data?: any[]
  chartTitle?: string
  showPNG?: boolean
  showSVG?: boolean
  showCSV?: boolean
  showJSON?: boolean
  className?: string
  children?: ReactNode
}

export default function ExportButton({
  containerRef,
  data,
  chartTitle = 'chart',
  showPNG = true,
  showSVG = true,
  showCSV = false,
  showJSON = false,
  className = '',
  children,
}: ExportButtonProps) {
  const handleExportPNG = async () => {
    const svg = getSVGElement(containerRef)
    if (svg) {
      try {
        await exportSVGAsPNG(svg, `${chartTitle}.png`)
      } catch (error) {
        console.error('Failed to export PNG:', error)
      }
    }
  }

  const handleExportSVG = () => {
    const svg = getSVGElement(containerRef)
    if (svg) {
      exportSVGAsSVG(svg, `${chartTitle}.svg`)
    }
  }

  const handleExportCSV = () => {
    if (data && data.length > 0) {
      exportDataAsCSV(data, `${chartTitle}.csv`)
    }
  }

  const handleExportJSON = () => {
    if (data && data.length > 0) {
      exportDataAsJSON(data, `${chartTitle}.json`)
    }
  }

  if (children) {
    return (
      <div className={className}>
        {showPNG && (
          <button onClick={handleExportPNG} className="mr-2">
            {children} PNG
          </button>
        )}
        {showSVG && (
          <button onClick={handleExportSVG} className="mr-2">
            {children} SVG
          </button>
        )}
        {showCSV && data && (
          <button onClick={handleExportCSV} className="mr-2">
            {children} CSV
          </button>
        )}
        {showJSON && data && (
          <button onClick={handleExportJSON}>
            {children} JSON
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {showPNG && (
        <button
          onClick={handleExportPNG}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Export PNG
        </button>
      )}
      {showSVG && (
        <button
          onClick={handleExportSVG}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Export SVG
        </button>
      )}
      {showCSV && data && (
        <button
          onClick={handleExportCSV}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Export CSV
        </button>
      )}
      {showJSON && data && (
        <button
          onClick={handleExportJSON}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Export JSON
        </button>
      )}
    </div>
  )
}

