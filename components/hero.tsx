import Link from "next/link"
import { HeroScene } from "./floating-coins"

export function Hero() {
  return (
    <section className="relative min-h-screen bg-navy pt-16 overflow-hidden">
      {/* 3D Floating Elements */}
      <HeroScene />
      
      {/* Gold radial glow */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30"
        style={{
          background: "radial-gradient(circle at center, #D4A843 0%, transparent 70%)",
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 px-4 py-2 mb-8">
              <span className="text-gold">◎</span>
              <span className="text-xs sm:text-sm text-white/90 uppercase tracking-wider">
                The Modern Savings Circle — For Everyone
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
              <span className="text-white">Save Together.</span>
              <br />
              <span className="text-gold">Grow Together.</span>
            </h1>

            {/* Subtext */}
            <p className="text-white/70 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              UpCircle makes group savings simple, transparent, and trusted. 
              Whether you call it an Ekub, Tanda, Ajo, Paluwagan — or just a savings 
              circle with your friends, family, or coworkers — UpCircle makes it work.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-4 text-lg font-medium text-navy hover:opacity-90 transition-opacity"
              >
                Start Your Circle
                <span>→</span>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <span>🔒</span> Bank-level security
              </span>
              <span className="flex items-center gap-2">
                <span className="text-gold">✦</span> Free to join
              </span>
              <span className="flex items-center gap-2">
                <span className="text-gold">◎</span> No credit card needed
              </span>
            </div>
          </div>

          {/* Right Content - App Mock */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total in Circles</p>
                  <p className="text-white text-4xl font-semibold">$4,800</p>
                </div>
                <div className="flex items-center gap-2 bg-gold/20 rounded-full px-3 py-1.5">
                  <span className="text-gold text-sm">✦</span>
                  <span className="text-gold text-sm font-medium">Trust 92</span>
                </div>
              </div>

              {/* Circle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h3 className="text-white font-medium text-sm">Friends Savings Circle</h3>
                      <p className="text-white/50 text-xs">Round 3/8</p>
                    </div>
                  </div>
                  <p className="text-gold text-xl font-semibold mb-3">$1,600</p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light" 
                      style={{ width: "38%" }}
                    />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">🏡</span>
                    <div>
                      <h3 className="text-white font-medium text-sm">Family Dream Fund</h3>
                      <p className="text-white/50 text-xs">Round 5/10</p>
                    </div>
                  </div>
                  <p className="text-gold text-xl font-semibold mb-3">$3,200</p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light" 
                      style={{ width: "50%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
