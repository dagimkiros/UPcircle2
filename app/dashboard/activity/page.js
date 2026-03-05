import { createClient } from '@/lib/supabase/server'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contributions } = await supabase
    .from('contributions')
    .select('*, circles(name, emoji)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: payouts } = await supabase
    .from('payouts')
    .select('*, circles(name, emoji)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Merge and sort
  const all = [
    ...(contributions || []).map(c => ({ ...c, type: 'contribution', amount: -c.amount })),
    ...(payouts || []).map(p => ({ ...p, type: 'payout', amount: p.amount })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>Activity</h1>

      {all.length === 0 ? (
        <div className="rounded-3xl p-12 text-center" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
          <p className="text-4xl mb-3">↕</p>
          <p className="text-navy font-semibold mb-1">No activity yet</p>
          <p className="text-gray-400 text-sm">Your contributions and payouts will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
          {all.map((item, i) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 px-4 py-4"
              style={{ borderBottom: i < all.length - 1 ? '1px solid #F5F0E8' : 'none' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: item.type === 'payout' ? '#4A7C6F18' : '#F5F0E8' }}>
                {item.circles?.emoji || (item.type === 'payout' ? '✦' : '↑')}
              </div>
              <div className="flex-1">
                <p className="text-navy text-sm font-semibold">{item.circles?.name || 'Circle'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: item.type === 'payout' ? '#4A7C6F18' : '#EAE3D5',
                      color: item.type === 'payout' ? '#4A7C6F' : '#6B7A8D'
                    }}>
                    {item.type}
                  </span>
                  <p className="text-gray-400 text-xs">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-sm" style={{ color: item.amount > 0 ? '#4A7C6F' : '#0D1F3C' }}>
                {item.amount > 0 ? '+' : ''}{fmt(item.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
