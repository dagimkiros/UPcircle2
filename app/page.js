import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1F3C 0%, #162D52 60%, #1a3660 100%)' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">◎</span>
          <span className="text-white font-bold text-xl" style={{ fontFamily: 'DM Serif Display, serif' }}>UpCircle</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-colors">
            Sign In
          </Link>
          <Link href="/auth/signup" className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 tracking-wider"
          style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)' }}>
          🌍 BUILT FOR IMMIGRANT COMMUNITIES
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Save Together.<br />
          <span style={{ color: '#D4A843' }}>Grow Together.</span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          UpCircle modernizes the traditional savings circle — Ekub, Tanda, Ajo, Paluwagan —
          with transparency, trust scores, and automated payments. Your community's way, upgraded.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup"
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', boxShadow: '0 8px 32px rgba(212,168,67,0.4)' }}>
            Start Your Circle →
          </Link>
          <Link href="/auth/login"
            className="px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            Sign In
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-white/30 text-sm mt-8">Free to join · No credit card required · Bank-level security</p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🔒', title: 'Transparent & Safe', desc: 'Every member sees the full payout schedule in real time. No surprises, no hidden fees.' },
            { icon: '⚡', title: 'Automated Payments', desc: 'Set it and forget it. Contributions are collected automatically each cycle.' },
            { icon: '⭐', title: 'Trust Scores', desc: 'Build your financial reputation. On-time payments boost your score and unlock better circles.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
