'use client'

import { exportToCSV, exportToJSON } from '@/lib/utils/exportData'

export interface DataExportButtonProps {
  data: any[]
  filename?: string
  headers?: string[]
  showCSV?: boolean
  showJSON?: boolean
  className?: string
}

export default function DataExportButton({
  data,
  filename = 'data',
  headers,
  showCSV = true,
  showJSON = true,
  className = '',
}: DataExportButtonProps) {
  const handleCSVExport = () => {
    exportToCSV(data, `${filename}.csv`, headers)
  }

  const handleJSONExport = () => {
    exportToJSON(data, `${filename}.json`)
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {showCSV && (
        <button
          onClick={handleCSVExport}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      )}
      {showJSON && (
        <button
          onClick={handleJSONExport}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export JSON
        </button>
      )}
    </div>
  )
}

