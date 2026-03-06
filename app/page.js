import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#F5F0E8', minHeight: '100vh' }}>

      {/* ── HEADER / NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,31,60,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212,168,67,0.15)',
        boxShadow: '0 2px 24px rgba(13,31,60,0.4)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#0D1F3C', fontWeight: '900', boxShadow: '0 4px 14px rgba(212,168,67,0.45)' }}>◎</div>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: '900', color: '#F5F0E8', letterSpacing: '-0.3px' }}>UpCircle</span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {[['How it Works', '#how'], ['Features', '#features'], ['Community', '#community'], ['FAQ', '#faq']].map(([label, href]) => (
              <a key={label} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#D4A843'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                {label}
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/auth/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', padding: '8px 16px' }}>
              Sign In
            </Link>
            <Link href="/auth/signup" style={{ padding: '10px 22px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', textDecoration: 'none', boxShadow: '0 4px 14px rgba(212,168,67,0.4)' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(160deg, #0D1F3C 0%, #162D52 65%, #1A3660 100%)', padding: '100px 24px 120px', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '100px', background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '32px' }}>
            🌍 BUILT FOR IMMIGRANT COMMUNITIES
          </div>

          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: '900', color: '#F5F0E8', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
            Save Together.<br />
            <span style={{ color: '#D4A843' }}>Grow Together.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', lineHeight: '1.7', maxWidth: '620px', margin: '0 auto 48px', fontWeight: '400' }}>
            UpCircle brings your community's savings tradition — Ekub, Tanda, Ajo, Paluwagan — into the digital age with full transparency, automated tracking, and trust scores.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link href="/auth/signup" style={{ padding: '16px 36px', borderRadius: '16px', fontSize: '17px', fontWeight: '800', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', textDecoration: 'none', boxShadow: '0 8px 32px rgba(212,168,67,0.45)' }}>
              Start Your Circle →
            </Link>
            <a href="#how" style={{ padding: '16px 36px', borderRadius: '16px', fontSize: '17px', fontWeight: '700', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none' }}>
              See How It Works
            </a>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {['🔒 Bank-level security', '✦ Free to join', '◎ No credit card needed'].map(item => (
              <span key={item} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: '600' }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Mock app card */}
        <div style={{ maxWidth: '680px', margin: '72px auto 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px', padding: '28px', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', fontWeight: '700', marginBottom: '4px' }}>TOTAL IN CIRCLES</p>
              <p style={{ color: 'white', fontSize: '36px', fontWeight: '900', fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>$4,800</p>
            </div>
            <div style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '100px', padding: '8px 18px', color: '#D4A843', fontSize: '13px', fontWeight: '700' }}>✦ Trust 92</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { emoji: '🇪🇹', name: 'Habesha Family Circle', amount: '$1,600', round: '3/8', progress: 38 },
              { emoji: '🇲🇽', name: 'Tanda DMV Group', amount: '$3,200', round: '5/10', progress: 50 },
            ].map(c => (
              <div key={c.name} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{c.emoji}</div>
                  <div>
                    <p style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>{c.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Round {c.round}</p>
                  </div>
                </div>
                <p style={{ color: '#D4A843', fontSize: '18px', fontWeight: '900', fontFamily: 'DM Serif Display, serif', marginBottom: '8px' }}>{c.amount}</p>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: 'linear-gradient(90deg, #D4A843, #F0C96A)', borderRadius: '99px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY NAMES ── */}
      <section style={{ background: '#0D1F3C', padding: '24px', borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[['🇪🇹', 'Ekub', 'Ethiopian'], ['🇲🇽', 'Tanda', 'Mexican'], ['🇳🇬', 'Ajo', 'Nigerian'], ['🇵🇭', 'Paluwagan', 'Filipino'], ['🇮🇳', 'Chit Fund', 'Indian'], ['🇧🇷', 'Consórcio', 'Brazilian']].map(([flag, name, community]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '22px' }}>{flag}</span>
              <p style={{ color: '#D4A843', fontSize: '14px', fontWeight: '700', margin: '4px 0 2px' }}>{name}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{community}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '100px 24px', background: '#F5F0E8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px' }}>HOW IT WORKS</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '46px', fontWeight: '900', color: '#0D1F3C', marginBottom: '16px' }}>Simple as 1, 2, 3</h2>
            <p style={{ color: '#6B7A8D', fontSize: '18px', maxWidth: '520px', margin: '0 auto' }}>Get a savings circle running in under 5 minutes</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {[
              { step: '01', icon: '◎', title: 'Create Your Circle', desc: 'Set the contribution amount, frequency, and number of members. Choose your payout order.' },
              { step: '02', icon: '🔗', title: 'Invite Your People', desc: 'Share a link with your trusted family or friends. They join with one tap — no app download needed.' },
              { step: '03', icon: '✦', title: 'Save & Get Paid', desc: 'Everyone contributes each cycle. When it\'s your turn, you receive the full pot automatically.' },
            ].map((item) => (
              <div key={item.step} style={{ background: 'white', borderRadius: '24px', padding: '36px 28px', border: '1.5px solid #EAE3D5', boxShadow: '0 4px 24px rgba(13,31,60,0.06)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '20px', right: '24px', fontFamily: 'DM Serif Display, serif', fontSize: '64px', fontWeight: '900', color: 'rgba(212,168,67,0.08)', lineHeight: 1 }}>{item.step}</div>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #0D1F3C, #162D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#D4A843', marginBottom: '20px', boxShadow: '0 4px 16px rgba(13,31,60,0.2)' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: '900', color: '#0D1F3C', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: '#6B7A8D', fontSize: '15px', lineHeight: '1.65' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 24px', background: '#0D1F3C' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px' }}>FEATURES</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '46px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Everything your circle needs</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '520px', margin: '0 auto' }}>Built specifically for community savings — not generic finance tools</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '🔒', title: 'Full Transparency', desc: 'Every member sees the complete payout schedule, who has paid, and who hasn\'t. No surprises.' },
              { icon: '⭐', title: 'Trust Scores', desc: 'Build your financial reputation. Consistent on-time payments raise your score and open doors.' },
              { icon: '📅', title: 'Payout Scheduling', desc: 'Fair rotation system with a clear schedule everyone can see from day one.' },
              { icon: '🔔', title: 'Smart Reminders', desc: 'Automatic notifications when contributions are due. No more chasing people.' },
              { icon: '📊', title: 'Circle Dashboard', desc: 'Real-time view of your circle\'s progress, members, and upcoming payouts.' },
              { icon: '🌍', title: 'Multi-community', desc: 'Run multiple circles across different communities. Ethiopian, Nigerian, Mexican — all in one place.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY TESTIMONIALS ── */}
      <section id="community" style={{ padding: '100px 24px', background: '#F5F0E8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px' }}>COMMUNITY</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '46px', fontWeight: '900', color: '#0D1F3C', marginBottom: '16px' }}>Trusted by our community</h2>
            <p style={{ color: '#6B7A8D', fontSize: '18px', maxWidth: '520px', margin: '0 auto' }}>Real people using UpCircle to save with their families and friends</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { name: 'Tigist M.', community: 'Ethiopian · Virginia', quote: 'We used to manage our ekub over WhatsApp with spreadsheets. UpCircle made it so much easier — everyone can see exactly where we are.', avatar: 'TM' },
              { name: 'Carlos R.', community: 'Mexican · Texas', quote: 'I\'ve been in tandas my whole life. This is the first time I\'ve felt completely confident that everyone is on the same page.', avatar: 'CR' },
              { name: 'Amaka O.', community: 'Nigerian · Maryland', quote: 'The trust score feature is genius. It actually gives people a reason to pay on time. Our ajo group has had zero issues since we started.', avatar: 'AO' },
            ].map(t => (
              <div key={t.name} style={{ background: 'white', borderRadius: '24px', padding: '32px 28px', border: '1.5px solid #EAE3D5', boxShadow: '0 4px 20px rgba(13,31,60,0.06)' }}>
                <p style={{ color: '#6B7A8D', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#0D1F3C' }}>{t.avatar}</div>
                  <div>
                    <p style={{ color: '#0D1F3C', fontWeight: '800', fontSize: '14px' }}>{t.name}</p>
                    <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{t.community}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px' }}>FAQ</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '46px', fontWeight: '900', color: '#0D1F3C' }}>Common questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: 'Is UpCircle free to use?', a: 'Yes — completely free during our launch period. We plan to introduce optional premium features in the future, but the core savings circle experience will always be free.' },
              { q: 'Does real money move through the app?', a: 'Not yet. Right now UpCircle handles the coordination, tracking, and trust scoring. Members transfer money directly to each other. Payment automation is coming soon.' },
              { q: 'Is my information secure?', a: 'Yes. We use bank-level encryption, secure authentication, and never store sensitive financial data. Your personal data is never sold or shared.' },
              { q: 'How many people can be in a circle?', a: 'Between 2 and 50 members per circle. You can run multiple circles at the same time.' },
              { q: 'What if someone doesn\'t pay?', a: 'Circle admins can track payment status and send reminders. Late payments affect a member\'s trust score, which is visible to all circle members.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#F9F6F1', borderRadius: '16px', padding: '24px 28px', border: '1.5px solid #EAE3D5' }}>
                <p style={{ color: '#0D1F3C', fontSize: '16px', fontWeight: '800', marginBottom: '10px' }}>{item.q}</p>
                <p style={{ color: '#6B7A8D', fontSize: '15px', lineHeight: '1.65' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #0D1F3C 0%, #162D52 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.15), transparent 70%)' }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '52px', fontWeight: '900', color: 'white', marginBottom: '20px', lineHeight: '1.1' }}>
            Ready to start saving<br /><span style={{ color: '#D4A843' }}>with your community?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
            Join hundreds of families already using UpCircle to save together the right way.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-block', padding: '18px 48px', borderRadius: '16px', fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#0D1F3C', textDecoration: 'none', boxShadow: '0 8px 32px rgba(212,168,67,0.45)' }}>
            Create Your Free Account →
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '20px' }}>Free forever · No credit card · Takes 2 minutes</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#080F1A', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Top footer */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #F0C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#0D1F3C', fontWeight: '900' }}>◎</div>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px', color: 'white', fontWeight: '900' }}>UpCircle</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', lineHeight: '1.7', maxWidth: '280px' }}>
                Modernizing the community savings tradition for immigrant families across the world.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                {['🇪🇹', '🇲🇽', '🇳🇬', '🇵🇭', '🇮🇳'].map(f => (
                  <span key={f} style={{ fontSize: '20px' }}>{f}</span>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>PRODUCT</p>
              {['How it Works', 'Features', 'Trust Scores', 'Security', 'Pricing'].map(item => (
                <p key={item} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none' }}>{item}</a>
                </p>
              ))}
            </div>

            {/* Community */}
            <div>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>COMMUNITY</p>
              {['Ethiopian Ekub', 'Mexican Tanda', 'Nigerian Ajo', 'Filipino Paluwagan', 'Indian Chit Fund'].map(item => (
                <p key={item} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none' }}>{item}</a>
                </p>
              ))}
            </div>

            {/* Company */}
            <div>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>COMPANY</p>
              {['About Us', 'Blog', 'Careers', 'Contact', 'Press'].map(item => (
                <p key={item} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none' }}>{item}</a>
                </p>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />

          {/* Bottom footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
              © 2026 UpCircle. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>
              Made with ♥ for immigrant communities
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}