'use client'

import { useState } from 'react'
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns'

export type DateRangePreset = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL' | 'CUSTOM'

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangePickerProps {
  selectedRange?: DateRange
  onRangeChange: (range: DateRange, preset: DateRangePreset) => void
  presets?: DateRangePreset[]
  className?: string
}

const DEFAULT_PRESETS: DateRangePreset[] = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'ALL']

export default function DateRangePicker({
  selectedRange,
  onRangeChange,
  presets = DEFAULT_PRESETS,
  className = '',
}: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<DateRangePreset>('1M')
  const [customStart, setCustomStart] = useState<string>('')
  const [customEnd, setCustomEnd] = useState<string>('')
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  const getPresetRange = (preset: DateRangePreset): DateRange => {
    const end = endOfDay(new Date())
    let start: Date

    switch (preset) {
      case '1D':
        start = startOfDay(subDays(end, 1))
        break
      case '1W':
        start = startOfDay(subDays(end, 7))
        break
      case '1M':
        start = startOfDay(subMonths(end, 1))
        break
      case '3M':
        start = startOfDay(subMonths(end, 3))
        break
      case '6M':
        start = startOfDay(subMonths(end, 6))
        break
      case '1Y':
        start = startOfDay(subYears(end, 1))
        break
      case '5Y':
        start = startOfDay(subYears(end, 5))
        break
      case 'ALL':
        start = startOfDay(subYears(end, 20)) // Default to 20 years for "ALL"
        break
      default:
        start = startOfDay(subMonths(end, 1))
    }

    return { start, end }
  }

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === 'CUSTOM') {
      setShowCustomPicker(true)
      setActivePreset('CUSTOM')
    } else {
      setShowCustomPicker(false)
      setActivePreset(preset)
      const range = getPresetRange(preset)
      onRangeChange(range, preset)
    }
  }

  const handleCustomRangeApply = () => {
    if (!customStart || !customEnd) {
      alert('Please select both start and end dates')
      return
    }

    const start = startOfDay(new Date(customStart))
    const end = endOfDay(new Date(customEnd))

    if (start > end) {
      alert('Start date must be before end date')
      return
    }

    onRangeChange({ start, end }, 'CUSTOM')
    setShowCustomPicker(false)
  }

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range) return ''
    return `${format(range.start, 'MMM dd, yyyy')} - ${format(range.end, 'MMM dd, yyyy')}`
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activePreset === preset
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {showCustomPicker && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCustomRangeApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setShowCustomPicker(false)
                setCustomStart('')
                setCustomEnd('')
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedRange && !showCustomPicker && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {formatDateRange(selectedRange)}
        </div>
      )}
    </div>
  )
}

