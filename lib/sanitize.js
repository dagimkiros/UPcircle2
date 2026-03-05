**
 * UpCircle Input Sanitization & Validation
 * 
 * All user input passes through here before touching the database.
 * Protects against: XSS, stored script injection, oversized inputs,
 * invalid data types, and malformed values.
 */

// Strip HTML tags and dangerous characters from strings
export function sanitizeText(input) {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-related patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
}

// Sanitize but allow basic punctuation (for descriptions)
export function sanitizeDescription(input) {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/\0/g, '')
    .slice(0, 500) // Hard limit
}

// Validate and sanitize dollar amounts
export function sanitizeAmount(input) {
  const num = parseFloat(String(input).replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return null
  if (num <= 0) return null
  if (num > 100000) return null // Max $100k per contribution
  return Math.round(num * 100) / 100 // Round to 2 decimal places
}

// Validate email
export function sanitizeEmail(input) {
  if (typeof input !== 'string') return null
  const email = input.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return null
  if (email.length > 254) return null
  return email
}

// Validate circle name
export function validateCircleName(name) {
  const clean = sanitizeText(name)
  if (!clean) return { valid: false, error: 'Circle name is required' }
  if (clean.length < 3) return { valid: false, error: 'Name must be at least 3 characters' }
  if (clean.length > 50) return { valid: false, error: 'Name must be under 50 characters' }
  return { valid: true, value: clean }
}

// Validate full name
export function validateFullName(name) {
  const clean = sanitizeText(name)
  if (!clean) return { valid: false, error: 'Full name is required' }
  if (clean.length < 2) return { valid: false, error: 'Name must be at least 2 characters' }
  if (clean.length > 100) return { valid: false, error: 'Name must be under 100 characters' }
  // Only allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s'\-\.]+$/.test(clean)) return { valid: false, error: 'Name contains invalid characters' }
  return { valid: true, value: clean }
}

// Validate contribution amount
export function validateAmount(amount) {
  const clean = sanitizeAmount(amount)
  if (!clean) return { valid: false, error: 'Enter a valid amount between $1 and $100,000' }
  if (clean < 1) return { valid: false, error: 'Minimum contribution is $1' }
  return { valid: true, value: clean }
}

// Validate member count
export function validateMemberCount(count) {
  const num = parseInt(count)
  if (isNaN(num)) return { valid: false, error: 'Invalid member count' }
  if (num < 2) return { valid: false, error: 'Minimum 2 members required' }
  if (num > 50) return { valid: false, error: 'Maximum 50 members allowed' }
  return { valid: true, value: num }
}

// Validate password strength
export function validatePassword(password) {
  if (!password) return { valid: false, error: 'Password is required' }
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' }
  if (password.length > 128) return { valid: false, error: 'Password is too long' }
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain at least one uppercase letter' }
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain at least one number' }
  return { valid: true }
}

// Sanitize an entire circle form object
export function sanitizeCircleForm(form) {
  const errors = {}
  const clean = {}

  const nameResult = validateCircleName(form.name)
  if (!nameResult.valid) errors.name = nameResult.error
  else clean.name = nameResult.value

  clean.emoji = ['🤝','🇪🇹','🇲🇽','🇳🇬','🇧🇷','🇮🇳','🇵🇭','🌍','💛','🏡','🌱','⭐'].includes(form.emoji)
    ? form.emoji : '🤝'

  clean.description = sanitizeDescription(form.description || '')

  const amountResult = validateAmount(form.contribution_amount)
  if (!amountResult.valid) errors.contribution_amount = amountResult.error
  else clean.contribution_amount = amountResult.value

  const freqOptions = ['Weekly', 'Bi-weekly', 'Monthly']
  clean.frequency = freqOptions.includes(form.frequency) ? form.frequency : 'Monthly'

  const memberResult = validateMemberCount(form.total_members)
  if (!memberResult.valid) errors.total_members = memberResult.error
  else clean.total_members = memberResult.value

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: clean
  }
}