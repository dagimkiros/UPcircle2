import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

const card = { background: 'white', border: '1.5px solid #EAE3D5', borderRadius: '20px', boxShadow: '0 2px 16px rgba(13,31,60,0.06)' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: memberships } = await supabase
    .from('circle_members')
    .select(`*, circles (id, name, emoji, contribution_amount, frequency, total_members, current_round, next_payout_date, status)`)
    .eq('user_id', user.id)

  const allCircles = memberships?.filter(m => m.circles) || []
  const activeCircles = allCircles.filter(m => m.circles.status === 'active')
  const totalInCircles = activeCircles.reduce((sum, m) => sum + (m.circles.contribution_amount * m.circles.total_members), 0)

  const { data: recentContributions } = await supabase
    .from('contributions').select('*, circles(name, emoji)')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const trustScore = profile?.trust_score || 70

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Hero */}
      <div style={{ borderRadius: '24px', padding: '28px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, #0D1F3C 0%, #162D52 100%)', boxShadow: '0 8px 32px rgba(13,31,60,0.25)' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.2), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.08), transparent 70%)' }} />
        <p style={{ color: '#D4A843', fontSize: '10px', fontWeight: '700', letterSpacing: '2.5px', marginBottom: '4px', position: 'relative' }}>GOOD DAY</p>
        <h1 style={{ color: '#F5F0E8', fontSize: '26px', fontWeight: '900', marginBottom: '20px', fontFamily: 'DM Serif Display, serif', position: 'relative' }}>
          {firstName} 👋
        </h1>
        <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '18px 20px', position: 'relative', backdropFilter: 'blur(8px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: '700', letterSpacing: '2px', marginBottom: '6px' }}>TOTAL IN CIRCLES</p>
          <p style={{ color: '#F5F0E8', fontSize: '38px', fontWeight: '900', lineHeight: 1, marginBottom: '8px', fontFamily: 'DM Serif Display, serif' }}>{fmt(totalInCircles)}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{activeCircles.length} active circle{activeCircles.length !== 1 ? 's' : ''}</p>
            <p style={{ color: '#D4A843', fontSize: '12px', fontWeight: '700' }}>✦ Trust {trustScore}/100</p>
          </div>
        </div>
        <div style={{ marginTop: '14px', position: 'relative' }}>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${trustScore}%`, background: 'linear-gradient(90deg, #D4A843, #F0C96A)', borderRadius: '99px' }} />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Link href="/dashboard/circles/new" style={{ ...card, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '700', color: '#F5F0E8', background: '#0D1F3C', textDecoration: 'none', border: '1.5px solid #0D1F3C' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>＋</div>
          New Circle
        </Link>
        <Link href="/dashboard/circles/join" style={{ ...card, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '700', color: '#0D1F3C', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🔗</div>
          Join Circle
        </Link>
      </div>

      {/* My Circles */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ color: '#0D1F3C', fontSize: '19px', fontWeight: '900', fontFamily: 'DM Serif Display, serif' }}>My Circles</h2>
          <Link href="/dashboard/circles" style={{ fontSize: '12px', fontWeight: '700', color: '#D4A843', textDecoration: 'none' }}>See all →</Link>
        </div>

        {allCircles.length === 0 ? (
          <div style={{ ...card, padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>◎</p>
            <p style={{ color: '#0D1F3C', fontWeight: '700', fontSize: '16px', marginBottom: '6px', fontFamily: 'DM Serif Display, serif' }}>No circles yet</p>
            <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '20px' }}>Create or join a savings circle to get started.</p>
            <Link href="/dashboard/circles/new" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '14px', fontWeight: '700', fontSize: '14px', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', textDecoration: 'none', boxShadow: '0 4px 16px rgba(212,168,67,0.35)' }}>
              Start a Circle
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allCircles.slice(0, 3).map(m => {
              const c = m.circles
              const pot = c.contribution_amount * c.total_members
              const progress = Math.round((c.current_round / c.total_members) * 100)
              const isActive = c.status === 'active'
              return (
                <Link href={`/dashboard/circles/${c.id}`} key={c.id} style={{ ...card, padding: '18px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                        {c.emoji || '◎'}
                      </div>
                      <div>
                        <p style={{ color: '#0D1F3C', fontWeight: '800', fontSize: '15px', marginBottom: '3px' }}>{c.name}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '600' }}>{c.total_members} members · {c.frequency}</p>
                      </div>
                    </div>
                    <span style={{ background: isActive ? 'rgba(74,124,111,0.1)' : 'rgba(212,168,67,0.1)', color: isActive ? '#4A7C6F' : '#D4A843', border: `1px solid ${isActive ? 'rgba(74,124,111,0.2)' : 'rgba(212,168,67,0.2)'}`, borderRadius: '100px', padding: '4px 12px', fontSize: '10px', fontWeight: '800', flexShrink: 0 }}>
                      {c.status === 'active' ? 'Active' : 'Forming'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F5F0E8', borderRadius: '14px', padding: '12px 16px', marginBottom: '12px' }}>
                    {[['POT SIZE', fmt(pot)], ['YOUR SPOT', `#${m.position || '—'}`], ['ROUND', `${c.current_round}/${c.total_members}`]].map(([label, val]) => (
                      <div key={label}>
                        <p style={{ color: '#9CA3AF', fontSize: '9px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
                        <p style={{ color: label === 'YOUR SPOT' ? '#D4A843' : '#0D1F3C', fontSize: '17px', fontWeight: '900', fontFamily: 'DM Serif Display, serif' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: '6px', background: '#EAE3D5', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #D4A843, #F0C96A)', borderRadius: '99px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600' }}>Round {c.current_round} of {c.total_members}</span>
                    <span style={{ fontSize: '11px', color: '#D4A843', fontWeight: '800' }}>{progress}%</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentContributions && recentContributions.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#0D1F3C', fontSize: '19px', fontWeight: '900', fontFamily: 'DM Serif Display, serif' }}>Recent Activity</h2>
            <Link href="/dashboard/activity" style={{ fontSize: '12px', fontWeight: '700', color: '#D4A843', textDecoration: 'none' }}>See all →</Link>
          </div>
          <div style={{ ...card, overflow: 'hidden' }}>
            {recentContributions.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: i < recentContributions.length - 1 ? '1px solid #F5F0E8' : 'none' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {c.circles?.emoji || '↑'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#0D1F3C', fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{c.circles?.name}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: '600' }}>{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <p style={{ color: '#0D1F3C', fontWeight: '800', fontSize: '15px', fontFamily: 'DM Serif Display, serif' }}>-{fmt(c.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}