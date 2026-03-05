'use client'
import { useState } from 'react'

export default function CopyInviteButton({ url }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy}
      className="px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all"
      style={{
        background: copied ? '#4A7C6F' : 'linear-gradient(135deg, #D4A843, #F0C96A)',
        color: copied ? 'white' : '#0D1F3C'
      }}>
      {copied ? '✓ Copied!' : '📋 Copy'}
    </button>
  )
}
