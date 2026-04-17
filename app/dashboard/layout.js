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
 const firstName = profile?.full_name?.split(' ')[0] || 'there'


 return (
   <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FB', fontFamily: 'DM Sans, sans-serif' }}>


     {/* ── SIDEBAR ── */}
     <aside style={{
       width: '240px', background: '#0D1F3C', minHeight: '100vh',
       display: 'flex', flexDirection: 'column', padding: '24px 16px',
       position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 40
     }} className="hidden md:flex">


       {/* Logo */}
       <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '32px', textDecoration: 'none' }}>
         <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#0D1F3C', fontWeight: '900', boxShadow: '0 4px 12px rgba(212,168,67,0.4)' }}>◎</div>
         <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px', color: 'white' }}>UpCircle</span>
       </Link>


       {/* Nav */}
       <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.3)', padding: '0 12px', marginBottom: '8px' }}>MAIN</p>
       {[
         { href: '/dashboard', icon: '⌂', label: 'Home' },
         { href: '/dashboard/circles', icon: '◎', label: 'My Circles' },
         { href: '/dashboard/circles/new', icon: '＋', label: 'New Circle' },
         { href: '/dashboard/activity', icon: '↕', label: 'Activity' },
       ].map(tab => (
         <Link key={tab.href} href={tab.href} style={{
           display: 'flex', alignItems: 'center', gap: '12px',
           padding: '11px 12px', borderRadius: '12px', fontSize: '14px',
           fontWeight: '600', color: 'rgba(255,255,255,0.55)',
           textDecoration: 'none', marginBottom: '2px', transition: 'all 0.2s'
         }}>
           <span style={{ width: '20px', textAlign: 'center', fontSize: '16px' }}>{tab.icon}</span>
           {tab.label}
         </Link>
       ))}


       <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.3)', padding: '0 12px', marginBottom: '8px', marginTop: '24px' }}>ACCOUNT</p>
       {[
         { href: '/dashboard/profile', icon: '◉', label: 'Profile' },
       ].map(tab => (
         <Link key={tab.href} href={tab.href} style={{
           display: 'flex', alignItems: 'center', gap: '12px',
           padding: '11px 12px', borderRadius: '12px', fontSize: '14px',
           fontWeight: '600', color: 'rgba(255,255,255,0.55)',
           textDecoration: 'none', marginBottom: '2px'
         }}>
           <span style={{ width: '20px', textAlign: 'center', fontSize: '16px' }}>{tab.icon}</span>
           {tab.label}
         </Link>
       ))}


       {/* User card */}
       <div style={{ marginTop: 'auto' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
           <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#0D1F3C', flexShrink: 0 }}>
             {initials}
           </div>
           <div style={{ flex: 1, minWidth: 0 }}>
             <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.full_name || user.email}</div>
             <div style={{ fontSize: '11px', color: '#D4A843', fontWeight: '600' }}>✦ Trust {trustScore}</div>
           </div>
           <LogoutButton />
         </div>
       </div>
     </aside>


     {/* ── MOBILE TOP NAV ── */}
     <div style={{
       position: 'sticky', top: 0, zIndex: 40,
       background: '#0D1F3C', padding: '0 16px', height: '56px',
       justifyContent: 'space-between', alignItems: 'center',
       boxShadow: '0 2px 12px rgba(13,31,60,0.2)'
     }} className="flex md:hidden">
       <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
         <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#0D1F3C', fontWeight: '900' }}>◎</div>
         <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: 'white' }}>UpCircle</span>
       </Link>
       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
         <div style={{ fontSize: '12px', color: '#D4A843', fontWeight: '700' }}>✦ {trustScore}</div>
         <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#0D1F3C' }}>{initials}</div>
       </div>
     </div>


     {/* ── MAIN CONTENT ── */}
     <main style={{ marginLeft: '240px', flex: 1, padding: '32px', paddingBottom: '40px', paddingTop: '32px', minWidth: 0 }} className="hidden md:block">
       {children}
     </main>
     <main style={{ flex: 1, padding: '16px', paddingBottom: '24px' }} className="md:hidden">
       {children}
     </main>
   </div>
 )
}

