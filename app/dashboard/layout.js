import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, trust_score')
    .eq('id', user.id)
    .single()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase()

  const trustScore = profile?.trust_score || 70

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(13,31,60,0.98)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212,168,67,0.15)',
        boxShadow: '0 2px 20px rgba(13,31,60,0.3)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#0D1F3C', fontWeight: '900', boxShadow: '0 3px 12px rgba(212,168,67,0.4)' }}>◎</div>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px', fontWeight: '900', color: '#F5F0E8' }}>UpCircle</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: '100px', padding: '5px 14px', fontSize: '12px', fontWeight: '700', color: '#D4A843' }}>
              ✦ Trust {trustScore}
            </div>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#0D1F3C', boxShadow: '0 3px 10px rgba(212,168,67,0.35)' }}>
              {initials}
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid #EAE3D5', boxShadow: '0 -4px 24px rgba(13,31,60,0.08)', display: 'flex' }} className="md:hidden">
        {[
          { href: '/dashboard', icon: '⌂', label: 'Home' },
          { href: '/dashboard/circles', icon: '◎', label: 'Circles' },
          { href: '/dashboard/activity', icon: '↕', label: 'Activity' },
          { href: '/dashboard/profile', icon: '◉', label: 'Profile' },
        ].map(tab => (
          <Link key={tab.href} href={tab.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 0 14px', textDecoration: 'none', color: '#9CA3AF', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            {tab.label}
          </Link>
        ))}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex' }}>
        <aside style={{ width: '220px', padding: '28px 16px', position: 'sticky', top: '60px', alignSelf: 'flex-start', height: 'calc(100vh - 60px)', flexShrink: 0 }} className="hidden md:flex md:flex-col">
          {[
            { href: '/dashboard', icon: '⌂', label: 'Home' },
            { href: '/dashboard/circles', icon: '◎', label: 'My Circles' },
            { href: '/dashboard/circles/new', icon: '＋', label: 'New Circle' },
            { href: '/dashboard/activity', icon: '↕', label: 'Activity' },
            { href: '/dashboard/profile', icon: '◉', label: 'Profile' },
          ].map(tab => (
            <Link key={tab.href} href={tab.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#6B7A8D', textDecoration: 'none', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </aside>

        <main style={{ flex: 1, padding: '28px 20px', paddingBottom: '96px', maxWidth: '680px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}