'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentStatus() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment) {
      setStatus(payment)
      // Clear from URL after 5 seconds
      setTimeout(() => setStatus(null), 5000)
    }
  }, [searchParams])

  if (!status) return null

  const isSuccess = status === 'success'

  return (
    <div style={{
      padding: '14px 18px', borderRadius: '14px', marginBottom: '20px',
      background: isSuccess ? 'rgba(74,124,111,0.1)' : 'rgba(212,168,67,0.1)',
      border: `1px solid ${isSuccess ? 'rgba(74,124,111,0.2)' : 'rgba(212,168,67,0.2)'}`,
      display: 'flex', alignItems: 'center', gap: '10px'
    }}>
      <span style={{ fontSize: '20px' }}>{isSuccess ? '✅' : '⚠️'}</span>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '700', color: isSuccess ? '#4A7C6F' : '#D4A843', marginBottom: '2px' }}>
          {isSuccess ? 'Payment successful!' : 'Payment cancelled'}
        </p>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
          {isSuccess ? 'Your contribution has been recorded and your trust score updated.' : 'Your payment was not completed. Try again when ready.'}
        </p>
      </div>
    </div>
  )
}
