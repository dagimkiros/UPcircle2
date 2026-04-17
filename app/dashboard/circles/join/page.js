'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function JoinCirclePage() {
  const router = useRouter()
  const [circleId, setCircleId] = useState('')
  const [circle, setCircle] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

  const handleLookup = async () => {
    setLoading(true)
    setError('')
    setCircle(null)
    const supabase = await createClient()

    // Extract ID from URL or use directly
    const id = circleId.includes('/join/') ? circleId.split('/join/')[1].trim() : circleId.trim()

    const { data, error: fetchError } = await supabase
      .from('circles')
      .select('*, circle_members(count)')
      .eq('id', id)
      .single()

    if (fetchError || !data) {
      setError('Circle not found. Check your invite link.')
    } else {
      setCircle(data)
    }
    setLoading(false)
  }

  const handleJoin = async () => {
    setJoining(true)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check already a member
    const { data: existing } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circle.id)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      router.push(`/dashboard/circles/${circle.id}`)
      return
    }

    // Get current member count for position
    const { count } = await supabase
      .from('circle_members')
      .select('*', { count: 'exact', head: true })
      .eq('circle_id', circle.id)

    if (count >= circle.total_members) {
      setError('This circle is full.')
      setJoining(false)
      return
    }

    await supabase.from('circle_members').insert({
      circle_id: circle.id,
      user_id: user.id,
      position: count + 1,
      role: 'member',
      payment_status: 'pending',
    })

    router.push(`/dashboard/circles/${circle.id}`)
  }

  return (
    <div>
      <button onClick={() => router.back()} className="text-gray-400 text-sm font-semibold hover:text-navy mb-6">← Back</button>
      <h1 className="text-2xl font-bold text-navy mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>Join a Circle</h1>
      <p className="text-gray-400 text-sm mb-6">Paste your invite link or circle ID below.</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: '#C0544E18', color: '#C0544E', border: '1px solid #C0544E30' }}>
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input value={circleId} onChange={e => setCircleId(e.target.value)}
          placeholder="Paste invite link or circle ID..."
          className="flex-1 px-4 py-3 rounded-xl text-navy text-sm"
          style={{ background: 'white', border: '1.5px solid #EAE3D5' }} />
        <button onClick={handleLookup} disabled={loading || !circleId}
          className="px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
          {loading ? '...' : 'Find'}
        </button>
      </div>

      {circle && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #EAE3D5' }}>
          <div className="p-5 text-center" style={{ background: 'linear-gradient(135deg, #0D1F3C, #162D52)' }}>
            <p className="text-4xl">{circle.emoji || '◎'}</p>
            <h2 className="text-white font-bold text-xl mt-2" style={{ fontFamily: 'DM Serif Display, serif' }}>{circle.name}</h2>
            {circle.description && <p className="text-white/40 text-xs mt-1">{circle.description}</p>}
          </div>
          {[
            ['Contribution', `${fmt(circle.contribution_amount)} / ${circle.frequency}`],
            ['Members', `${circle.circle_members?.[0]?.count || '?'}/${circle.total_members}`],
            ['Total Pot', fmt(circle.contribution_amount * circle.total_members)],
            ['Status', circle.status],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-5 py-3" style={{ borderTop: '1px solid #EAE3D5', background: 'white' }}>
              <span className="text-gray-400 text-sm">{k}</span>
              <span className="text-navy font-bold text-sm capitalize">{v}</span>
            </div>
          ))}
          <div className="p-4" style={{ background: 'white', borderTop: '1px solid #EAE3D5' }}>
            <button onClick={handleJoin} disabled={joining}
              className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
              {joining ? 'Joining...' : '🤝 Join This Circle'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
