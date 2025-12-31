'use client'

import { useState, useCallback } from 'react'
import {
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
  SESSION_STORAGE_KEYS,
} from '@/lib/storage/sessionStorage'

/**
 * React hook for sessionStorage with type safety
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @param ttl - Time to live in seconds (optional)
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  ttl?: number
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = getSessionStorageItem<T>(key)
      return item ?? initialValue
    } catch (error) {
      console.error(`Error loading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to sessionStorage
        if (typeof window !== 'undefined') {
          setSessionStorageItem(key, valueToStore, ttl)
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue, ttl]
  )

  // Remove value from sessionStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        removeSessionStorageItem(key)
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for accessing predefined session storage keys
 */
export function useSessionPreferenceStorage<T>(
  key: keyof typeof SESSION_STORAGE_KEYS,
  initialValue: T,
  ttl?: number
) {
  return useSessionStorage<T>(SESSION_STORAGE_KEYS[key], initialValue, ttl)
}

export { SESSION_STORAGE_KEYS }

