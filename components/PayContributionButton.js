'use client'
import { useState } from 'react'

export default function PayContributionButton({ circleId, circleName, amount }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circleId, circleName, amount }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      // Redirect to Stripe checkout
      window.location.href = data.url

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const fmt = (n) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  return (
    <div>
      {error && (
        <div style={{ background: 'rgba(192,84,78,0.1)', border: '1px solid rgba(192,84,78,0.3)', borderRadius: '12px', padding: '10px 16px', marginBottom: '12px', color: '#c0544e', fontSize: '13px' }}>
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%', padding: '14px', borderRadius: '14px',
          fontSize: '15px', fontWeight: '800',
          background: loading ? '#EAE3D5' : 'linear-gradient(135deg, #D4A843, #F0C96A)',
          color: loading ? '#9CA3AF' : '#0D1F3C',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(212,168,67,0.35)',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px'
        }}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #9CA3AF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Redirecting to payment...
          </>
        ) : (
          <>💳 Pay Contribution — {fmt(amount)}</>
        )}
      </button>
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
        🔒 Secured by Stripe · Test mode active
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
