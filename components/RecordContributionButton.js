'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RecordContributionButton({ circleId, members, contributionAmount }) {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const handleRecord = async () => {
    if (!selectedMember) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('contributions').insert({
      circle_id: circleId,
      user_id: selectedMember,
      amount: contributionAmount,
      recorded_by: user.id,
    })

    // Update member payment status
    await supabase.from('circle_members')
      .update({ payment_status: 'current' })
      .eq('circle_id', circleId)
      .eq('user_id', selectedMember)

    setSuccess(true)
    setLoading(false)
    setSelectedMember('')
    setTimeout(() => { setSuccess(false); router.refresh() }, 1500)
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 tracking-wider mb-2">RECORD CONTRIBUTION</p>
      <div className="flex gap-2">
        <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm text-navy"
          style={{ background: '#F5F0E8', border: '1.5px solid #EAE3D5' }}>
          <option value="">Select member...</option>
          {members?.map(m => (
            <option key={m.id} value={m.user_id}>
              {m.profiles?.full_name || m.profiles?.email} — {fmt(contributionAmount)}
            </option>
          ))}
        </select>
        <button onClick={handleRecord} disabled={!selectedMember || loading}
          className="px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
          style={{ background: success ? '#4A7C6F' : 'linear-gradient(135deg, #D4A843, #F0C96A)', color: success ? 'white' : '#0D1F3C' }}>
          {loading ? '...' : success ? '✓ Done' : 'Record'}
        </button>
      </div>
    </div>
  )
}
