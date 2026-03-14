import { Users, Link as LinkIcon, Banknote } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Create Your Circle",
    description: "Set contribution amount, frequency, and number of members. Customize to fit your group's needs.",
  },
  {
    number: "02",
    icon: LinkIcon,
    title: "Invite Your People",
    description: "Share a link with friends, family, or coworkers. Anyone can join with just one tap.",
  },
  {
    number: "03",
    icon: Banknote,
    title: "Save & Get Paid",
    description: "Contribute each cycle and receive the full pot when it's your turn. Simple and fair.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-medium uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mb-4">
            Simple as 1, 2, 3
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Get a savings circle running in under 5 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-card rounded-3xl border-[1.5px] border-card-border p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Watermark Number */}
              <span 
                className="absolute top-6 right-6 font-serif text-6xl lg:text-7xl text-gold/[0.08] select-none"
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl lg:text-2xl text-navy mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
