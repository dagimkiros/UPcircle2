'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const EMOJIS = ['🤝','🇪🇹','🇲🇽','🇳🇬','🇧🇷','🇮🇳','🇵🇭','🌍','💛','🏡','🌱','⭐']

export default function NewCirclePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', emoji: '🤝', description: '',
    contribution_amount: '', frequency: 'Monthly', total_members: '6'
  })

  const pot = (parseInt(form.contribution_amount) || 0) * (parseInt(form.total_members) || 0)
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { data: circle, error: circleError } = await supabase
      .from('circles')
      .insert({
        name: form.name,
        emoji: form.emoji,
        description: form.description,
        contribution_amount: parseInt(form.contribution_amount),
        frequency: form.frequency,
        total_members: parseInt(form.total_members),
        current_round: 1,
        status: 'forming',
        created_by: user.id,
      })
      .select()
      .single()

    if (circleError) { setError(circleError.message); setLoading(false); return }

    const { error: memberError } = await supabase.from('circle_members').insert({
      circle_id: circle.id,
      user_id: user.id,
      position: 1,
      role: 'admin',
      payment_status: 'current',
    })

    if (memberError) { setError(memberError.message); setLoading(false); return }

    router.push(`/dashboard/circles/${circle.id}?created=1`)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-navy text-sm transition-all"
  const inputStyle = { background: 'white', border: '1.5px solid #EAE3D5' }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="text-gray-400 text-sm font-semibold hover:text-navy mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>Create a Circle</h1>
        <p className="text-gray-400 text-sm mt-1">Step {step} of 3</p>
        <div className="flex gap-2 mt-3">
          {[1,2,3].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: s <= step ? '#D4A843' : '#EAE3D5' }} />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: '#C0544E18', color: '#C0544E', border: '1px solid #C0544E30' }}>
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="font-bold text-navy text-lg" style={{ fontFamily: 'DM Serif Display, serif' }}>Name your circle</h2>
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wider block mb-2">PICK AN EMOJI</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                  className="w-11 h-11 rounded-xl text-xl transition-all"
                  style={{
                    background: form.emoji === e ? '#0D1F3C' : '#F5F0E8',
                    border: form.emoji === e ? '2px solid #D4A843' : '2px solid transparent'
                  }}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wider block mb-2">CIRCLE NAME</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Habesha Family Circle" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wider block mb-2">DESCRIPTION (OPTIONAL)</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell members about this circle..." rows={3}
              className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-bold text-navy text-lg" style={{ fontFamily: 'DM Serif Display, serif' }}>Set the terms</h2>
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wider block mb-2">CONTRIBUTION AMOUNT (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input type="number" value={form.contribution_amount} onChange={e => setForm({ ...form, contribution_amount: e.target.value })}
                placeholder="0" min="1"
                className={inputClass} style={{ ...inputStyle, paddingLeft: '2rem' }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wider block mb-2">FREQUENCY</label>
            <div className="flex gap-2">
              {['Weekly','Bi-weekly','Monthly'].map(f => (
                <button key={f} onClick={() => setForm({ ...form, frequency: f })}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: form.frequency === f ? '#0D1F3C' : '#F5F0E8',
                    color: form.frequency === f ? 'white' : '#6B7A8D',
                    border: form.frequency === f ? '2px solid #D4A843' : '2px solid transparent'
                  }}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wider block mb-2">NUMBER OF MEMBERS</label>
            <div className="flex gap-2 flex-wrap">
              {['4','6','8','10','12'].map(n => (
                <button key={n} onClick={() => setForm({ ...form, total_members: n })}
                  className="w-14 py-3 rounded-xl font-bold text-base transition-all"
                  style={{
                    background: form.total_members === n ? '#0D1F3C' : '#F5F0E8',
                    color: form.total_members === n ? 'white' : '#6B7A8D',
                    border: form.total_members === n ? '2px solid #D4A843' : '2px solid transparent'
                  }}>{n}</button>
              ))}
            </div>
          </div>
          {pot > 0 && (
            <div className="p-4 rounded-2xl" style={{ background: '#4A7C6F12', border: '1px solid #4A7C6F30' }}>
              <p className="text-xs font-semibold tracking-wider" style={{ color: '#4A7C6F' }}>EACH MEMBER RECEIVES</p>
              <p className="text-3xl font-bold mt-1" style={{ color: '#4A7C6F', fontFamily: 'DM Serif Display, serif' }}>{fmt(pot)}</p>
              <p className="text-xs text-gray-400 mt-1">{form.total_members} members × {fmt(parseInt(form.contribution_amount))}</p>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-bold text-navy text-lg" style={{ fontFamily: 'DM Serif Display, serif' }}>Review & Launch</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #EAE3D5' }}>
            <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #0D1F3C, #162D52)' }}>
              <p className="text-4xl">{form.emoji}</p>
              <p className="text-white font-bold text-xl mt-2" style={{ fontFamily: 'DM Serif Display, serif' }}>{form.name || 'My Circle'}</p>
            </div>
            {[
              ['Contribution', `${fmt(parseInt(form.contribution_amount)||0)} / ${form.frequency}`],
              ['Members', form.total_members],
              ['Total Pot', fmt(pot)],
              ['Duration', `${form.total_members} ${form.frequency === 'Weekly' ? 'weeks' : 'months'}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-5 py-3.5" style={{ borderTop: '1px solid #EAE3D5', background: 'white' }}>
                <span className="text-gray-400 text-sm">{k}</span>
                <span className="text-navy font-bold text-sm">{v}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl text-sm" style={{ background: '#D4A84315', border: '1px solid #D4A84340' }}>
            🔗 After creating, you'll get a shareable invite link to send to your members.
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}
            className="flex-1 py-4 rounded-2xl font-bold text-navy transition-all"
            style={{ background: '#F5F0E8', border: '1px solid #EAE3D5' }}>
            Back
          </button>
        )}
        <button
          onClick={() => step < 3 ? setStep(step + 1) : handleCreate()}
          disabled={loading || (step === 1 && !form.name) || (step === 2 && !form.contribution_amount)}
          className="flex-[2] py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:scale-100"
          style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', boxShadow: '0 4px 16px rgba(212,168,67,0.4)' }}>
          {loading ? 'Creating...' : step === 3 ? '🚀 Launch Circle' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}