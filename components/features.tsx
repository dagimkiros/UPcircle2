import { Eye, Star, Calendar, Bell, BarChart3, Globe } from "lucide-react"
import { FeaturesScene } from "./floating-coins"

const features = [
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Payout schedule visible to all members. Everyone knows exactly where the money is.",
  },
  {
    icon: Star,
    title: "Trust Scores",
    description: "Build your financial reputation with on-time payments. Earn credibility in your community.",
  },
  {
    icon: Calendar,
    title: "Payout Scheduling",
    description: "Fair rotation with a clear schedule from day one. No surprises, no conflicts.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Automatic notifications when contributions are due. Never miss a payment.",
  },
  {
    icon: BarChart3,
    title: "Circle Dashboard",
    description: "Real-time progress, member activity, and upcoming payouts all in one place.",
  },
  {
    icon: Globe,
    title: "Works for Everyone",
    description: "Friends, family, coworkers, or any community. UpCircle adapts to your needs.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative bg-navy py-20 lg:py-28 overflow-hidden">
      {/* 3D Background */}
      <FeaturesScene />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-medium uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white">
            Everything your circle needs
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-navy" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
