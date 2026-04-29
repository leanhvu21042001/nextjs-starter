import { useEffect, useState } from 'react'

/**
 * Custom hook to debounce a value
 * @param value The value to debounce (e.g., search term)
 * @param delay The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler) // Cleanup the timeout on value or delay change
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
