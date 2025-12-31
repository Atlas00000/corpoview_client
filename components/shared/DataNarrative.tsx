'use client'

import { ReactNode } from 'react'

export interface DataNarrativeProps {
  title?: string
  content: ReactNode
  insights?: string[]
  className?: string
}

export default function DataNarrative({
  title = 'Insights',
  content,
  insights,
  className = '',
}: DataNarrativeProps) {
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          {title}
        </h3>
      )}
      
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {content}
      </div>

      {insights && insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Key Takeaways:
          </h4>
          <ul className="space-y-1">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

