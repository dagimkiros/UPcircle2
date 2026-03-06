'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sanitizeEmail } from '@/lib/sanitize'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client-side rate limiting (5 attempts max)
    if (attempts >= 5) {
      setError('Too many failed attempts. Please wait 15 minutes before trying again.')
      setLoading(false)
      return
    }

    // Validate email format
    const cleanEmail = sanitizeEmail(email)
    if (!cleanEmail) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    // Basic password check
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
    if (error) {
      setAttempts(a => a + 1)
      // Generic error message — don't reveal if email exists or not
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>Welcome back</h2>
      <p className="text-white/50 text-sm mb-6">Sign in to your account</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(192,84,78,0.15)', color: '#f87171', border: '1px solid rgba(192,84,78,0.3)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-white/60 text-xs font-semibold tracking-wider block mb-2">EMAIL</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        </div>
        <div>
          <label className="text-white/60 text-xs font-semibold tracking-wider block mb-2">PASSWORD</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-navy transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 mt-2"
          style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>

      <p className="text-center text-white/40 text-sm mt-6">
        No account?{' '}
        <Link href="/auth/signup" className="font-semibold" style={{ color: '#D4A843' }}>Create one free</Link>
      </p>
    </div>
  )
}