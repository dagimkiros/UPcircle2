import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

export default async function PublicJoinPage({ params }) {
  const supabase = await createClient()
  const { data: circle } = await supabase
    .from('circles')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: { user } } = await supabase.auth.getUser()

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #0D1F3C, #162D52)' }}>
        <div className="text-center text-white">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Circle not found</h1>
          <p className="text-white/50 text-sm">This invite link may be invalid or expired.</p>
          <Link href="/" className="block mt-6 text-gold-light font-semibold" style={{ color: '#D4A843' }}>← Go home</Link>
        </div>
      </div>
    )
  }

  const pot = circle.contribution_amount * circle.total_members

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0D1F3C 0%, #162D52 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-3xl">◎</span>
          <h1 className="text-white text-xl font-bold mt-1" style={{ fontFamily: 'DM Serif Display, serif' }}>UpCircle</h1>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="p-6 text-center">
            <p className="text-5xl">{circle.emoji || '◎'}</p>
            <h2 className="text-white font-bold text-2xl mt-3" style={{ fontFamily: 'DM Serif Display, serif' }}>{circle.name}</h2>
            <p className="text-white/40 text-sm mt-1">You've been invited to join a savings circle</p>
          </div>

          <div className="px-5 pb-5 space-y-2">
            {[
              ['💰 Contribution', `${fmt(circle.contribution_amount)} per ${circle.frequency.toLowerCase()}`],
              ['👥 Group size', `${circle.total_members} members`],
              ['🏆 Each member receives', fmt(pot)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span className="text-white/50 text-sm">{k}</span>
                <span className="text-white font-semibold text-sm">{v}</span>
              </div>
            ))}
          </div>

          <div className="px-5 pb-6">
            {user ? (
              <Link href={`/dashboard/circles/join?id=${circle.id}`}
                className="block w-full py-4 rounded-2xl font-bold text-center transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
                🤝 Join This Circle
              </Link>
            ) : (
              <div className="space-y-3">
                <Link href={`/auth/signup?redirect=/join/${circle.id}`}
                  className="block w-full py-4 rounded-2xl font-bold text-center transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
                  Create Account & Join →
                </Link>
                <Link href={`/auth/login?redirect=/join/${circle.id}`}
                  className="block w-full py-4 rounded-2xl font-bold text-center text-white/70 text-sm"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Already have an account? Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
