'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  STORAGE_KEYS,
} from '@/lib/storage/localStorage'

/**
 * React hook for localStorage with automatic sync and type safety
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @param ttl - Time to live in seconds (optional)
 */
export function useLocalStorage<T>(
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
      const item = getLocalStorageItem<T>(key)
      return item ?? initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to localStorage
        if (typeof window !== 'undefined') {
          setLocalStorageItem(key, valueToStore, ttl)
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, ttl]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        removeLocalStorageItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes to this key in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed.value !== undefined) {
            setStoredValue(parsed.value)
          }
        } catch {
          // Ignore parse errors
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for accessing predefined storage keys
 */
export function usePreferenceStorage<T>(key: keyof typeof STORAGE_KEYS, initialValue: T, ttl?: number) {
  return useLocalStorage<T>(STORAGE_KEYS[key], initialValue, ttl)
}

export { STORAGE_KEYS }

