'use client'

import { useState } from 'react'
import { generateShareableUrl, copyToClipboard, shareUrl } from '@/lib/utils/shareUtils'
import { ShareableLinkParams } from '@/lib/utils/shareUtils'

export interface ShareButtonProps {
  basePath: string
  params: ShareableLinkParams
  title?: string
  text?: string
  className?: string
}

export default function ShareButton({
  basePath,
  params,
  title,
  text,
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  const handleShare = async () => {
    const url = generateShareableUrl(basePath, params)
    setSharing(true)

    // Try native share first
    const shared = await shareUrl(url, title, text)

    if (!shared) {
      // Fallback to copy to clipboard
      const success = await copyToClipboard(url)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        alert('Failed to share URL. Please copy it manually.')
      }
    }

    setSharing(false)
  }

  const handleCopy = async () => {
    const url = generateShareableUrl(basePath, params)
    const success = await copyToClipboard(url)
    
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      alert('Failed to copy URL to clipboard')
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleShare}
        disabled={sharing}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {sharing ? 'Sharing...' : 'Share'}
      </button>
      
      <button
        onClick={handleCopy}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
          copied
            ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}

