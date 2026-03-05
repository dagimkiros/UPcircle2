import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's circle memberships
  const { data: memberships } = await supabase
    .from('circle_members')
    .select(`
      *, 
      circles (id, name, emoji, contribution_amount, frequency, total_members, current_round, next_payout_date, status)
    `)
    .eq('user_id', user.id)
    .eq('circles.status', 'active')

  const activeCircles = memberships?.filter(m => m.circles) || []
  const totalInCircles = activeCircles.reduce((sum, m) =>
    sum + (m.circles.contribution_amount * m.circles.total_members), 0)

  // Get recent contributions
  const { data: recentContributions } = await supabase
    .from('contributions')
    .select('*, circles(name, emoji)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0D1F3C, #162D52)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-8 translate-x-8"
          style={{ background: '#D4A843' }} />
        <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: '#D4A843' }}>GOOD DAY</p>
        <h1 className="text-white text-2xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {firstName} 👋
        </h1>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-white/50 text-xs tracking-wider mb-1">TOTAL IN CIRCLES</p>
          <p className="text-white text-3xl font-bold" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {fmt(totalInCircles)}
          </p>
          <p className="text-white/40 text-xs mt-1">{activeCircles.length} active circle{activeCircles.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full" style={{ width: `${profile?.trust_score || 70}%`, background: '#D4A843' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: '#D4A843' }}>Trust {profile?.trust_score || 70}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/circles/new"
          className="p-4 rounded-2xl flex items-center gap-3 font-semibold text-navy text-sm transition-all hover:scale-[1.02]"
          style={{ background: 'white', border: '1px solid #EAE3D5', boxShadow: '0 2px 8px rgba(13,31,60,0.06)' }}>
          <span className="text-xl">＋</span> New Circle
        </Link>
        <Link href="/dashboard/circles/join"
          className="p-4 rounded-2xl flex items-center gap-3 font-semibold text-navy text-sm transition-all hover:scale-[1.02]"
          style={{ background: 'white', border: '1px solid #EAE3D5', boxShadow: '0 2px 8px rgba(13,31,60,0.06)' }}>
          <span className="text-xl">🔗</span> Join Circle
        </Link>
      </div>

      {/* Active circles */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-navy font-bold text-lg" style={{ fontFamily: 'DM Serif Display, serif' }}>My Circles</h2>
          <Link href="/dashboard/circles" className="text-xs font-semibold" style={{ color: '#D4A843' }}>See all →</Link>
        </div>

        {activeCircles.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
            <p className="text-4xl mb-3">◎</p>
            <p className="text-navy font-semibold mb-1">No circles yet</p>
            <p className="text-gray-400 text-sm mb-4">Create or join a savings circle to get started.</p>
            <Link href="/dashboard/circles/new"
              className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
              Start a Circle
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCircles.map(m => {
              const c = m.circles
              const pot = c.contribution_amount * c.total_members
              const progress = Math.round((c.current_round / c.total_members) * 100)
              return (
                <Link href={`/dashboard/circles/${c.id}`} key={c.id}
                  className="block rounded-2xl p-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'white', border: '1px solid #EAE3D5', boxShadow: '0 2px 8px rgba(13,31,60,0.06)' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: '#F5F0E8' }}>{c.emoji || '◎'}</div>
                      <div>
                        <p className="font-bold text-navy text-sm">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.total_members} members · {c.frequency}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#4A7C6F18', color: '#4A7C6F' }}>Active</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Pot: <strong className="text-navy">{fmt(pot)}</strong></span>
                    <span className="text-gray-400">Round <strong className="text-navy">{c.current_round}/{c.total_members}</strong></span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#EAE3D5' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#4A7C6F' }} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      {recentContributions && recentContributions.length > 0 && (
        <div>
          <h2 className="text-navy font-bold text-lg mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>Recent Activity</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
            {recentContributions.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: i < recentContributions.length - 1 ? '1px solid #F5F0E8' : 'none' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: '#F5F0E8' }}>
                  {c.circles?.emoji || '↑'}
                </div>
                <div className="flex-1">
                  <p className="text-navy text-sm font-semibold">{c.circles?.name}</p>
                  <p className="text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-sm text-navy">-{fmt(c.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
