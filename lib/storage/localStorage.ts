/**
 * LocalStorage utility for client-side caching
 * Provides type-safe localStorage operations with expiration and validation
 */

export interface StorageItem<T> {
  value: T
  expires?: number // Timestamp in milliseconds
}

/**
 * Get an item from localStorage
 * Returns null if item doesn't exist, is expired, or is invalid
 */
export function getLocalStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const item = window.localStorage.getItem(key)
    if (!item) return null

    const parsed: StorageItem<T> = JSON.parse(item)

    // Check if item has expired
    if (parsed.expires && Date.now() > parsed.expires) {
      window.localStorage.removeItem(key)
      return null
    }

    return parsed.value
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return null
  }
}

/**
 * Set an item in localStorage with optional expiration
 * @param key - Storage key
 * @param value - Value to store
 * @param ttl - Time to live in seconds (optional)
 */
export function setLocalStorageItem<T>(key: string, value: T, ttl?: number): void {
  if (typeof window === 'undefined') return

  try {
    const item: StorageItem<T> = {
      value,
      ...(ttl && { expires: Date.now() + ttl * 1000 }),
    }

    window.localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded, clearing old items...')
      clearExpiredLocalStorageItems()
    }
  }
}

/**
 * Remove an item from localStorage
 */
export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}

/**
 * Clear all expired items from localStorage
 */
export function clearExpiredLocalStorageItems(): void {
  if (typeof window === 'undefined') return

  const keys = Object.keys(window.localStorage)
  let cleared = 0

  keys.forEach((key) => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return

      const parsed: StorageItem<unknown> = JSON.parse(item)
      if (parsed.expires && Date.now() > parsed.expires) {
        window.localStorage.removeItem(key)
        cleared++
      }
    } catch {
      // Ignore items that don't match our format
    }
  })

  if (cleared > 0) {
    console.log(`Cleared ${cleared} expired localStorage items`)
  }
}

/**
 * Clear all items from localStorage
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return
  window.localStorage.clear()
}

/**
 * Get all keys in localStorage
 */
export function getLocalStorageKeys(): string[] {
  if (typeof window === 'undefined') return []
  return Object.keys(window.localStorage)
}

/**
 * Storage keys for different data types
 */
export const STORAGE_KEYS = {
  // User preferences
  THEME: 'corpoview:theme',
  PREFERENCES: 'corpoview:preferences',
  
  // UI state
  SIDEBAR_COLLAPSED: 'corpoview:sidebar:collapsed',
  FILTERS: 'corpoview:filters',
  
  // Recently viewed
  RECENT_STOCKS: 'corpoview:recent:stocks',
  RECENT_CRYPTO: 'corpoview:recent:crypto',
  
  // Favorite assets
  FAVORITES: 'corpoview:favorites',
  
  // Chart preferences
  CHART_PREFERENCES: 'corpoview:chart:preferences',
} as const

