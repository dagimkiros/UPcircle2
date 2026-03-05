'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteCircleButton({ circleId }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('circle_members').delete().eq('circle_id', circleId)
    await supabase.from('contributions').delete().eq('circle_id', circleId)
    await supabase.from('circles').delete().eq('id', circleId)
    router.push('/dashboard/circles')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="p-3 rounded-xl" style={{ background: '#C0544E12', border: '1px solid #C0544E30' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#C0544E' }}>
          ⚠️ Are you sure? This will permanently delete the circle and all its data.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setConfirming(false)}
            className="flex-1 py-2 rounded-xl text-sm font-bold"
            style={{ background: '#F5F0E8', color: '#6B7A8D' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
            style={{ background: '#C0544E' }}>
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
      style={{ background: '#C0544E12', color: '#C0544E', border: '1px solid #C0544E30' }}>
      🗑️ Delete Circle
    </button>
  )
}