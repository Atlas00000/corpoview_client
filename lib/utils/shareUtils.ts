/**
 * Shareable link utilities
 */

export interface ShareableLinkParams {
  [key: string]: string | number | boolean | undefined
}

/**
 * Generate shareable URL with query parameters
 */
export function generateShareableUrl(
  basePath: string,
  params: ShareableLinkParams
): string {
  const url = new URL(basePath, window.location.origin)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

/**
 * Parse shareable URL parameters
 */
export function parseShareableUrl(searchParams: URLSearchParams): ShareableLinkParams {
  const params: ShareableLinkParams = {}

  searchParams.forEach((value, key) => {
    // Try to parse as number or boolean
    if (value === 'true') {
      params[key] = true
    } else if (value === 'false') {
      params[key] = false
    } else if (!isNaN(Number(value)) && value !== '') {
      params[key] = Number(value)
    } else {
      params[key] = value
    }
  })

  return params
}

/**
 * Copy URL to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Share URL using Web Share API (if available)
 */
export async function shareUrl(
  url: string,
  title?: string,
  text?: string
): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title || 'Check this out',
        text: text || '',
        url: url,
      })
      return true
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
      return false
    }
  }
  return false
}

