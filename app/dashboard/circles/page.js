import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

export default async function CirclesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: memberships } = await supabase
    .from('circle_members')
    .select('*, circles(*)')
    .eq('user_id', user.id)

  const circles = memberships?.filter(m => m.circles) || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>My Circles</h1>
        <Link href="/dashboard/circles/new"
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
          ＋ New
        </Link>
      </div>

      {circles.length === 0 ? (
        <div className="rounded-3xl p-12 text-center" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
          <p className="text-5xl mb-4">◎</p>
          <h2 className="text-navy font-bold text-xl mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>No circles yet</h2>
          <p className="text-gray-400 text-sm mb-6">Create your first savings circle or join one with an invite link.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/circles/new"
              className="px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
              Create Circle
            </Link>
            <Link href="/dashboard/circles/join"
              className="px-6 py-3 rounded-xl font-bold text-sm text-navy"
              style={{ background: '#F5F0E8', border: '1px solid #EAE3D5' }}>
              Join with Link
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {circles.map(m => {
            const c = m.circles
            const pot = c.contribution_amount * c.total_members
            const progress = Math.round((c.current_round / c.total_members) * 100)
            return (
              <Link href={`/dashboard/circles/${c.id}`} key={c.id}
                className="block rounded-2xl p-5 transition-all hover:scale-[1.01]"
                style={{ background: 'white', border: '1px solid #EAE3D5', boxShadow: '0 2px 8px rgba(13,31,60,0.06)' }}>
                <div className="flex gap-3 items-center mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#F5F0E8' }}>
                    {c.emoji || '◎'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy">{c.name}</p>
                    <p className="text-gray-400 text-xs">{c.total_members} members · {c.frequency} · {fmt(c.contribution_amount)}/round</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: c.status === 'active' ? '#4A7C6F18' : '#EAE3D5', color: c.status === 'active' ? '#4A7C6F' : '#6B7A8D' }}>
                    {c.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Pot: <strong className="text-navy">{fmt(pot)}</strong></span>
                  <span>Your spot: <strong className="text-navy">#{m.position}</strong></span>
                  <span>Round: <strong className="text-navy">{c.current_round}/{c.total_members}</strong></span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#EAE3D5' }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#4A7C6F' }} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
