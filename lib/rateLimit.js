/**
 * Simple in-memory rate limiter
 * Protects auth endpoints from brute force attacks
 * 
 * For production, replace with Redis-based solution (Upstash is free)
 */

const attempts = new Map()

export function checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const key = identifier.toLowerCase()

  if (!attempts.has(key)) {
    attempts.set(key, { count: 1, firstAttempt: now })
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  const record = attempts.get(key)

  // Reset window if expired
  if (now - record.firstAttempt > windowMs) {
    attempts.set(key, { count: 1, firstAttempt: now })
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  // Increment count
  record.count++
  attempts.set(key, record)

  if (record.count > maxAttempts) {
    const resetIn = Math.ceil((record.firstAttempt + windowMs - now) / 1000 / 60)
    return {
      allowed: false,
      remaining: 0,
      error: `Too many attempts. Try again in ${resetIn} minute${resetIn !== 1 ? 's' : ''}.`
    }
  }

  return { allowed: true, remaining: maxAttempts - record.count }
}

export function resetRateLimit(identifier) {
  attempts.delete(identifier.toLowerCase())
}