import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

const card = {
  background: 'white', borderRadius: '20px',
  border: '1.5px solid #F0EDE8',
  boxShadow: '0 2px 12px rgba(13,31,60,0.04)'
}

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
  const nextPayout = activeCircles.reduce((max, m) => Math.max(max, m.circles.contribution_amount * m.circles.total_members), 0)

  const { data: recentContributions } = await supabase
    .from('contributions').select('*, circles(name, emoji)')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const trustScore = profile?.trust_score || 70
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const statIconStyle = (bg) => ({
    width: '40px', height: '40px', borderRadius: '12px',
    background: bg, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '18px', marginBottom: '14px'
  })

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0D1F3C', fontFamily: 'DM Serif Display, serif', marginBottom: '4px' }}>
            Good day, {firstName} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>{today}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/dashboard/circles/join" style={{ padding: '11px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', background: 'white', color: '#0D1F3C', border: '1.5px solid #EAE3D5', textDecoration: 'none' }}>
            🔗 Join Circle
          </Link>
          <Link href="/dashboard/circles/new" style={{ padding: '11px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', textDecoration: 'none', boxShadow: '0 4px 14px rgba(212,168,67,0.35)' }}>
            ＋ New Circle
          </Link>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }} className="grid-cols-2 md:grid-cols-4">
        {[
          { icon: '💰', bg: '#0D1F3C', label: 'TOTAL IN CIRCLES', value: fmt(totalInCircles), sub: `${activeCircles.length} active circle${activeCircles.length !== 1 ? 's' : ''}`, subColor: '#4A7C6F' },
          { icon: '✦', bg: 'linear-gradient(135deg, #D4A843, #F0C96A)', label: 'TRUST SCORE', value: trustScore, sub: trustScore >= 80 ? 'Excellent' : trustScore >= 60 ? 'Good' : 'Building', subColor: '#D4A843', goldVal: true },
          { icon: '📅', bg: 'rgba(74,124,111,0.1)', label: 'NEXT PAYOUT', value: fmt(nextPayout), sub: 'Upcoming', subColor: '#9CA3AF' },
          { icon: '◎', bg: 'rgba(139,92,246,0.1)', label: 'CIRCLES JOINED', value: allCircles.length, sub: 'Total circles', subColor: '#9CA3AF' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '22px' }}>
            <div style={statIconStyle(s.bg)}>{s.icon}</div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '900', color: s.goldVal ? '#D4A843' : '#0D1F3C', fontFamily: 'DM Serif Display, serif', lineHeight: 1, marginBottom: '8px' }}>{s.value}</p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: s.subColor }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <Link href="/dashboard/circles/new" style={{ ...card, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', background: '#0D1F3C', border: '1.5px solid #0D1F3C' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>＋</div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '800', color: 'white', marginBottom: '2px' }}>Start a Circle</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Set up in 2 minutes</p>
          </div>
        </Link>
        <Link href="/dashboard/circles/join" style={{ ...card, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'rgba(212,168,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🔗</div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '800', color: '#0D1F3C', marginBottom: '2px' }}>Join a Circle</p>
            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>Enter invite code</p>
          </div>
        </Link>
      </div>

      {/* TWO COLUMN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }} className="grid-cols-1 md:grid-cols-[1fr_360px]">

        {/* CIRCLES */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: '#0D1F3C', fontFamily: 'DM Serif Display, serif' }}>My Circles</h2>
            <Link href="/dashboard/circles" style={{ fontSize: '13px', fontWeight: '700', color: '#D4A843', textDecoration: 'none' }}>See all →</Link>
          </div>

          {allCircles.length === 0 ? (
            <div style={{ ...card, padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '44px', marginBottom: '14px' }}>◎</p>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#0D1F3C', marginBottom: '8px', fontFamily: 'DM Serif Display, serif' }}>No circles yet</p>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>Create or join a savings circle to get started.</p>
              <Link href="/dashboard/circles/new" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '14px', fontWeight: '700', fontSize: '14px', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', textDecoration: 'none', boxShadow: '0 4px 16px rgba(212,168,67,0.35)' }}>
                Start a Circle
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {allCircles.slice(0, 4).map(m => {
                const c = m.circles
                const pot = c.contribution_amount * c.total_members
                const progress = Math.round((c.current_round / c.total_members) * 100)
                const isActive = c.status === 'active'
                return (
                  <Link href={`/dashboard/circles/${c.id}`} key={c.id} style={{ ...card, padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                          {c.emoji || '◎'}
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: '800', color: '#0D1F3C', marginBottom: '3px' }}>{c.name}</p>
                          <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>{c.total_members} members · {c.frequency}</p>
                        </div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '800', background: isActive ? 'rgba(74,124,111,0.1)' : 'rgba(212,168,67,0.12)', color: isActive ? '#4A7C6F' : '#D4A843', flexShrink: 0 }}>
                        {isActive ? 'Active' : 'Forming'}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#F8F9FB', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
                      {[['POT SIZE', fmt(pot), false], ['YOUR SPOT', `#${m.position || '—'}`, true], ['ROUND', `${c.current_round}/${c.total_members}`, false]].map(([label, val, gold]) => (
                        <div key={label}>
                          <p style={{ fontSize: '9px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
                          <p style={{ fontSize: '18px', fontWeight: '900', color: gold ? '#D4A843' : '#0D1F3C', fontFamily: 'DM Serif Display, serif' }}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: '6px', background: '#F0EDE8', borderRadius: '99px', overflow: 'hidden' }}>
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

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* TRUST CARD */}
          <div style={{ background: 'linear-gradient(145deg, #0D1F3C, #162D52)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.2), transparent 70%)' }} />
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', position: 'relative' }}>YOUR TRUST SCORE</p>
            <p style={{ fontSize: '52px', fontWeight: '900', color: '#D4A843', fontFamily: 'DM Serif Display, serif', lineHeight: 1, marginBottom: '4px', position: 'relative' }}>{trustScore}</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', position: 'relative' }}>
              {trustScore >= 80 ? 'Excellent · Top 10%' : trustScore >= 60 ? 'Good · Keep it up' : 'Building · Make payments on time'}
            </p>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden', marginBottom: '14px', position: 'relative' }}>
              <div style={{ height: '100%', width: `${trustScore}%`, background: 'linear-gradient(90deg, #D4A843, #F0C96A)', borderRadius: '99px', boxShadow: '0 0 10px rgba(212,168,67,0.4)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              {['On-time payments boost score', 'Complete circles earn bonus', 'Invite friends to grow faster'].map(tip => (
                <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4A843', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          {recentContributions && recentContributions.length > 0 && (
            <div style={{ ...card, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#0D1F3C', fontFamily: 'DM Serif Display, serif' }}>Recent Activity</h3>
                <Link href="/dashboard/activity" style={{ fontSize: '13px', fontWeight: '700', color: '#D4A843', textDecoration: 'none' }}>See all →</Link>
              </div>
              {recentContributions.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < recentContributions.length - 1 ? '1px solid #F8F9FB' : 'none' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {c.circles?.emoji || '↑'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#0D1F3C', marginBottom: '2px' }}>{c.circles?.name}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '800', color: '#0D1F3C', fontFamily: 'DM Serif Display, serif' }}>-{fmt(c.amount)}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}