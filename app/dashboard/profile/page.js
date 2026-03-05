import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: circleCount } = await supabase
    .from('circle_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: contributions } = await supabase
    .from('contributions')
    .select('amount')
    .eq('user_id', user.id)

  const totalSaved = contributions?.reduce((s, c) => s + c.amount, 0) || 0
  const trustScore = profile?.trust_score || 70
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || user.email[0].toUpperCase()

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="rounded-3xl p-6 text-center" style={{ background: 'linear-gradient(145deg, #0D1F3C, #162D52)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
          style={{ background: '#D4A843', color: '#0D1F3C', border: '3px solid rgba(255,255,255,0.2)' }}>
          {initials}
        </div>
        <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'DM Serif Display, serif' }}>{profile?.full_name || 'Member'}</h1>
        <p className="text-white/40 text-sm mt-1">{user.email}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)' }}>
          <span className="text-xs font-bold tracking-wider" style={{ color: '#D4A843' }}>TRUST SCORE</span>
          <span className="text-xl font-bold" style={{ color: '#D4A843', fontFamily: 'DM Serif Display, serif' }}>{trustScore}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Circles', val: circleCount || 0 },
          { label: 'Total Saved', val: fmt(totalSaved) },
          { label: 'On-time %', val: '100%' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
            <p className="font-bold text-navy text-lg" style={{ fontFamily: 'DM Serif Display, serif' }}>{s.val}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Trust score breakdown */}
      <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
        <h3 className="font-bold text-navy mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>Trust Score Breakdown</h3>
        {[
          { label: 'On-time payments', val: 100, color: '#4A7C6F' },
          { label: 'Identity verified', val: 80, color: '#4A7C6F' },
          { label: 'Circle completion', val: trustScore, color: '#D4A843' },
          { label: 'Member feedback', val: 90, color: '#4A7C6F' },
        ].map(item => (
          <div key={item.label} className="mb-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-navy text-sm">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.val}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: '#EAE3D5' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${item.val}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
        {[
          { icon: '🔔', label: 'Notifications', sub: 'Enabled' },
          { icon: '🛡️', label: 'Identity Verification', sub: 'Pending — coming soon' },
          { icon: '🏦', label: 'Linked Bank Account', sub: 'Connect via Plaid — coming soon' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50"
            style={{ borderBottom: i < 2 ? '1px solid #F5F0E8' : 'none' }}>
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-navy text-sm font-semibold">{item.label}</p>
              <p className="text-gray-400 text-xs">{item.sub}</p>
            </div>
            <span className="text-gray-300">›</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
        <div className="px-4 py-4">
          <LogoutButton full />
        </div>
      </div>
    </div>
  )
}
