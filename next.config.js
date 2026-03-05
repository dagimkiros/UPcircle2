/** @type {import('next').NextConfig} */

const securityHeaders = [
    // Prevents clickjacking — stops your app being embedded in iframes on other sites
    { key: 'X-Frame-Options', value: 'DENY' },
  
    // Stops browsers guessing content types (MIME sniffing attacks)
    { key: 'X-Content-Type-Options', value: 'nosniff' },
  
    // Forces HTTPS for 2 years, includes subdomains
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  
    // Controls what info is sent in the Referrer header
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  
    // Disables access to camera/mic/location etc.
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  
    // Content Security Policy — the most important one
    // Restricts where scripts, styles, images etc. can be loaded from
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline needed for Next.js — tighten after build
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    },
  
    // Prevents XSS attacks in older browsers
    { key: 'X-XSS-Protection', value: '1; mode=block' },
  ]
  
  const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
  }
  
  module.exports = nextConfig