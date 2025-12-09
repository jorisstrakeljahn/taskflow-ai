/**
 * Rate Limiting Hook
 *
 * Implements rate limiting for API calls to prevent abuse
 * and manage API costs. Uses a simple token bucket algorithm.
 */

import { useRef, useCallback } from 'react';

interface RateLimitOptions {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
}

interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // Milliseconds until next request is allowed
}

/**
 * Custom hook for rate limiting API calls
 *
 * @param options - Rate limit configuration
 * @returns Function to check if a request is allowed
 *
 * @example
 * ```tsx
 * const checkRateLimit = useRateLimit({
 *   maxRequests: 10,
 *   windowMs: 60000 // 1 minute
 * });
 *
 * const result = checkRateLimit();
 * if (!result.allowed) {
 *   // Wait for retryAfter milliseconds
 * }
 * ```
 */
export const useRateLimit = (options: RateLimitOptions) => {
  const { maxRequests, windowMs } = options;
  const requestTimestamps = useRef<number[]>([]);

  const checkRateLimit = useCallback((): RateLimitResult => {
    const now = Date.now();

    // Remove timestamps outside the current window
    requestTimestamps.current = requestTimestamps.current.filter(
      (timestamp) => now - timestamp < windowMs
    );

    // Check if we've exceeded the limit
    if (requestTimestamps.current.length >= maxRequests) {
      const oldestRequest = requestTimestamps.current[0];
      const retryAfter = windowMs - (now - oldestRequest);
      return { allowed: false, retryAfter };
    }

    // Add current request timestamp
    requestTimestamps.current.push(now);
    return { allowed: true };
  }, [maxRequests, windowMs]);

  return checkRateLimit;
};
