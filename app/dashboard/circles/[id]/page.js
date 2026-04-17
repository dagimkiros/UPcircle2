import PayContributionButton from '@/components/PayContributionButton'
import PaymentStatus from '@/components/PaymentStatus'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CopyInviteButton from '@/components/CopyInviteButton'
import DeleteCircleButton from '@/components/DeleteCircleButton'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
}

export default async function CircleDetailPage({ params, searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: circle } = await supabase
    .from('circles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!circle) notFound()

  const { data: members } = await supabase
    .from('circle_members')
    .select('*, profiles(full_name, email, trust_score)')
    .eq('circle_id', params.id)
    .order('position')

  const { data: contributions } = await supabase
    .from('contributions')
    .select('*, profiles(full_name)')
    .eq('circle_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const myMembership = members?.find(m => m.user_id === user.id)
  const isAdmin = myMembership?.role === 'admin'
  const pot = circle.contribution_amount * circle.total_members
  const progress = Math.round((circle.current_round / circle.total_members) * 100)
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/join/${circle.id}`
  const alreadyPaid = myMembership?.payment_status === 'current'

  return (
    <div className="space-y-5">
      {searchParams?.created && (
        <div className="p-4 rounded-2xl text-sm font-semibold" style={{ background: '#4A7C6F15', color: '#4A7C6F', border: '1px solid #4A7C6F30' }}>
          🎉 Circle created! Share the invite link below with your members.
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0D1F3C, #162D52)' }}>
        <Link href="/dashboard/circles" className="text-white/40 text-xs font-semibold hover:text-white/70">← My Circles</Link>
        <div className="flex gap-3 items-center mt-3 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {circle.emoji || '◎'}
          </div>
          <div>
            <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'DM Serif Display, serif' }}>{circle.name}</h1>
            <p className="text-white/50 text-xs">{circle.total_members} members · {circle.frequency} · {fmt(circle.contribution_amount)}/round</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'POT SIZE', val: fmt(pot) },
            { label: 'YOUR SPOT', val: myMembership ? `#${myMembership.position}` : '—' },
            { label: 'ROUND', val: `${circle.current_round}/${circle.total_members}` },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-[9px] tracking-wider font-semibold">{s.label}</p>
              <p className="font-bold text-lg mt-0.5" style={{ fontFamily: 'DM Serif Display, serif', color: '#F0C96A' }}>{s.val}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#D4A843' }} />
          </div>
          <p className="text-white/30 text-xs mt-1.5">Round {circle.current_round} of {circle.total_members} · {progress}% complete</p>
        </div>
      </div>

      {/* Payment status banner — shows after redirect from Stripe */}
      <PaymentStatus />

      {/* Pay contribution button */}
      {myMembership && ['active', 'forming'].includes(circle.status) && (
        <div style={{ background: 'white', border: '1.5px solid #EAE3D5', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(13,31,60,0.04)' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '1px', marginBottom: '6px' }}>YOUR CONTRIBUTION DUE</p>
          <p style={{ fontSize: '28px', fontWeight: '900', color: '#0D1F3C', fontFamily: 'DM Serif Display, serif', marginBottom: '4px' }}>{fmt(circle.contribution_amount)}</p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>Due this round · {circle.frequency}</p>
          {alreadyPaid && (
            <p style={{ fontSize: '12px', color: '#4A7C6F', fontWeight: '700', marginBottom: '12px' }}>
              Already marked paid for this round. You can still open Stripe checkout if needed.
            </p>
          )}
          <PayContributionButton
            circleId={circle.id}
            circleName={circle.name}
            amount={circle.contribution_amount}
          />
        </div>
      )}

      {/* Already paid indicator */}
      {myMembership && ['active', 'forming'].includes(circle.status) && alreadyPaid && (
        <div style={{ background: 'rgba(74,124,111,0.08)', border: '1.5px solid rgba(74,124,111,0.2)', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#4A7C6F' }}>Contribution paid for this round</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>You're all caught up · Trust score boosted</p>
          </div>
        </div>
      )}

      {/* Invite link */}
      {isAdmin && (
        <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
          <p className="text-xs font-semibold text-gray-400 tracking-wider mb-2">INVITE LINK</p>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-xl text-xs text-gray-500 font-mono truncate" style={{ background: '#F5F0E8' }}>
              {inviteUrl}
            </div>
            <CopyInviteButton url={inviteUrl} />
          </div>
        </div>
      )}

      {/* Members */}
      <div>
        <h2 className="font-bold text-navy mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>Members ({members?.length || 0}/{circle.total_members})</h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
          {members?.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">No members yet. Share the invite link!</p>
          )}
          {members?.map((m, i) => {
            const name = m.profiles?.full_name || m.profiles?.email || 'Member'
            const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            const isMe = m.user_id === user.id
            return (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: i < members.length - 1 ? '1px solid #F5F0E8' : 'none', background: isMe ? '#D4A84308' : 'white' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: isMe ? '#D4A843' : '#EAE3D5', color: isMe ? '#0D1F3C' : '#6B7A8D' }}>
                  {initials}
                </div>
                <div className="flex-1">
                  <p className="text-navy text-sm font-semibold">{name}{isMe ? ' (You)' : ''}</p>
                  <p className="text-gray-400 text-xs">Spot #{m.position} · Trust {m.profiles?.trust_score || 70}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: m.payment_status === 'current' ? '#4A7C6F18' : '#C0544E18',
                      color: m.payment_status === 'current' ? '#4A7C6F' : '#C0544E'
                    }}>
                    {m.payment_status === 'current' ? 'Paid' : 'Pending'}
                  </span>
                  {m.payout_received && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#D4A84318', color: '#D4A843' }}>
                      Received
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payout Schedule */}
      <div>
        <h2 className="font-bold text-navy mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>Payout Schedule</h2>
        <div className="space-y-2">
          {Array.from({ length: circle.total_members }, (_, i) => {
            const member = members?.find(m => m.position === i + 1)
            const name = member?.profiles?.full_name || `Member #${i + 1}`
            const isMe = member?.user_id === user.id
            const isCurrent = i + 1 === circle.current_round
            const isPast = i + 1 < circle.current_round
            return (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{
                  background: isMe ? '#0D1F3C' : isCurrent ? '#4A7C6F12' : 'white',
                  border: `1px solid ${isMe ? '#0D1F3C' : isCurrent ? '#4A7C6F40' : '#EAE3D5'}`
                }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: isMe ? '#D4A84325' : isCurrent ? '#4A7C6F20' : '#F5F0E8', color: isMe ? '#D4A843' : isCurrent ? '#4A7C6F' : '#6B7A8D' }}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: isMe ? 'white' : '#0D1F3C' }}>{name}{isMe ? ' (You)' : ''}</p>
                  <p className="text-xs" style={{ color: isMe ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>
                    {isPast ? '✓ Payout received' : isCurrent ? '⟳ Current round' : `Round ${i + 1}`}
                  </p>
                </div>
                <p className="font-bold" style={{ color: isMe ? '#D4A843' : '#0D1F3C', fontFamily: 'DM Serif Display, serif', fontSize: 16 }}>{fmt(pot)}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
          <h3 className="font-bold text-navy mb-3">Admin Actions</h3>
          <DeleteCircleButton circleId={circle.id} />
        </div>
      )}

      {/* Recent contributions */}
      {contributions && contributions.length > 0 && (
        <div>
          <h2 className="font-bold text-navy mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>Recent Contributions</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #EAE3D5' }}>
            {contributions.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < contributions.length - 1 ? '1px solid #F5F0E8' : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: '#F5F0E8' }}>↑</div>
                <div className="flex-1">
                  <p className="text-navy text-sm font-semibold">{c.profiles?.full_name || 'Member'}</p>
                  <p className="text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-sm text-navy">{fmt(c.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}