'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton({ full = false }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (full) {
    return (
      <button onClick={handleLogout}
        className="w-full text-left flex items-center gap-3 text-sm font-semibold"
        style={{ color: '#C0544E' }}>
        <span className="text-xl">🚪</span> Sign Out
      </button>
    )
  }

  return (
    <button onClick={handleLogout}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
      style={{ background: 'rgba(192,84,78,0.1)', color: '#C0544E' }}>
      Sign out
    </button>
  )
}
