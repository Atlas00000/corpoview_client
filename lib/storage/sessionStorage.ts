/**
 * SessionStorage utility for temporary client-side caching
 * Data is cleared when the browser tab/window is closed
 */

export interface SessionStorageItem<T> {
  value: T
  expires?: number // Timestamp in milliseconds
}

/**
 * Get an item from sessionStorage
 * Returns null if item doesn't exist, is expired, or is invalid
 */
export function getSessionStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const item = window.sessionStorage.getItem(key)
    if (!item) return null

    const parsed: SessionStorageItem<T> = JSON.parse(item)

    // Check if item has expired
    if (parsed.expires && Date.now() > parsed.expires) {
      window.sessionStorage.removeItem(key)
      return null
    }

    return parsed.value
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error)
    return null
  }
}

/**
 * Set an item in sessionStorage with optional expiration
 * @param key - Storage key
 * @param value - Value to store
 * @param ttl - Time to live in seconds (optional)
 */
export function setSessionStorageItem<T>(key: string, value: T, ttl?: number): void {
  if (typeof window === 'undefined') return

  try {
    const item: SessionStorageItem<T> = {
      value,
      ...(ttl && { expires: Date.now() + ttl * 1000 }),
    }

    window.sessionStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error)
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('SessionStorage quota exceeded, clearing old items...')
      clearExpiredSessionStorageItems()
    }
  }
}

/**
 * Remove an item from sessionStorage
 */
export function removeSessionStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(key)
}

/**
 * Clear all expired items from sessionStorage
 */
export function clearExpiredSessionStorageItems(): void {
  if (typeof window === 'undefined') return

  const keys = Object.keys(window.sessionStorage)
  let cleared = 0

  keys.forEach((key) => {
    try {
      const item = window.sessionStorage.getItem(key)
      if (!item) return

      const parsed: SessionStorageItem<unknown> = JSON.parse(item)
      if (parsed.expires && Date.now() > parsed.expires) {
        window.sessionStorage.removeItem(key)
        cleared++
      }
    } catch {
      // Ignore items that don't match our format
    }
  })

  if (cleared > 0) {
    console.log(`Cleared ${cleared} expired sessionStorage items`)
  }
}

/**
 * Clear all items from sessionStorage
 */
export function clearSessionStorage(): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.clear()
}

/**
 * Get all keys in sessionStorage
 */
export function getSessionStorageKeys(): string[] {
  if (typeof window === 'undefined') return []
  return Object.keys(window.sessionStorage)
}

/**
 * Session storage keys for temporary data
 */
export const SESSION_STORAGE_KEYS = {
  // Temporary UI state
  MODAL_STATE: 'corpoview:session:modal',
  FORM_DATA: 'corpoview:session:form',
  
  // Temporary search/filter state
  SEARCH_QUERY: 'corpoview:session:search',
  TEMP_FILTERS: 'corpoview:session:filters',
  
  // Temporary chart state
  CHART_STATE: 'corpoview:session:chart',
  
  // Temporary navigation state
  PREVIOUS_ROUTE: 'corpoview:session:previousRoute',
} as const

