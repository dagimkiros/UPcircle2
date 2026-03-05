'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Create profile row
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: form.full_name,
        email: form.email,
        trust_score: 70,
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>Check your email</h2>
        <p className="text-white/50 text-sm leading-relaxed">
          We sent a confirmation link to <strong className="text-white">{form.email}</strong>.
          Click it to activate your account, then sign in.
        </p>
        <Link href="/auth/login" className="block mt-6 py-3 rounded-xl font-bold text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
          Go to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>Create your account</h2>
      <p className="text-white/50 text-sm mb-6">Join the UpCircle community — free forever</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(192,84,78,0.15)', color: '#f87171', border: '1px solid rgba(192,84,78,0.3)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="text-white/60 text-xs font-semibold tracking-wider block mb-2">FULL NAME</label>
          <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required
            placeholder="Tigist Alemu"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        </div>
        <div>
          <label className="text-white/60 text-xs font-semibold tracking-wider block mb-2">EMAIL</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        </div>
        <div>
          <label className="text-white/60 text-xs font-semibold tracking-wider block mb-2">PASSWORD</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
            minLength={6} placeholder="At least 6 characters"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>

      <p className="text-center text-white/40 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold" style={{ color: '#D4A843' }}>Sign in</Link>
      </p>
    </div>
  )
}
