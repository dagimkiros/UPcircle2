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

  return (
    <div className="min-h-screen bg-cream">
      {/* Top navbar */}
      <nav className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(12px)', borderColor: '#EAE3D5' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl text-navy">◎</span>
            <span className="font-bold text-navy text-lg" style={{ fontFamily: 'DM Serif Display, serif' }}>UpCircle</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 font-medium">{profile?.full_name || user.email}</p>
              <p className="text-xs font-bold" style={{ color: '#D4A843' }}>Trust Score: {profile?.trust_score || 70}</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: '#D4A843', color: '#0D1F3C' }}>
              {initials}
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Bottom nav for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t md:hidden"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderColor: '#EAE3D5' }}>
        <div className="flex">
          {[
            { href: '/dashboard', icon: '⌂', label: 'Home' },
            { href: '/dashboard/circles', icon: '◎', label: 'Circles' },
            { href: '/dashboard/activity', icon: '↕', label: 'Activity' },
            { href: '/dashboard/profile', icon: '◉', label: 'Profile' },
          ].map(tab => (
            <Link key={tab.href} href={tab.href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-400 hover:text-navy transition-colors">
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="max-w-6xl mx-auto flex">
        <aside className="hidden md:flex flex-col w-56 py-8 px-4 sticky top-16 self-start h-[calc(100vh-4rem)]">
          {[
            { href: '/dashboard', icon: '⌂', label: 'Home' },
            { href: '/dashboard/circles', icon: '◎', label: 'My Circles' },
            { href: '/dashboard/circles/new', icon: '＋', label: 'New Circle' },
            { href: '/dashboard/activity', icon: '↕', label: 'Activity' },
            { href: '/dashboard/profile', icon: '◉', label: 'Profile' },
          ].map(tab => (
            <Link key={tab.href} href={tab.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-navy hover:bg-cream-dark transition-all mb-1">
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 px-4 py-6 pb-24 md:pb-8 max-w-2xl">
          {children}
        </main>
      </div>
    </div>
  )
}
