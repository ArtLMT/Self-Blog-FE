// =============================================================================
// Hooks: useDebounce
// =============================================================================
// Debounces a value by delaying updates until the user stops changing it.
// Commonly used for search inputs to avoid firing API calls on every keystroke.
// =============================================================================

'use client';

import { useEffect, useState } from 'react';

/**
 * Debounce a value with a configurable delay.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This only fires 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
