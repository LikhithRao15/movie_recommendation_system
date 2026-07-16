import { useState, useEffect } from 'react';

/**
 * Debounce a value by delaying its update
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in ms
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
