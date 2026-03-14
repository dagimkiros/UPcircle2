const testimonials = [
  {
    quote: "We used to manage our ekub over WhatsApp with spreadsheets. UpCircle made it so much easier — everyone can see exactly where we are.",
    name: "Tigist M.",
    location: "Virginia",
    initials: "TM",
  },
  {
    quote: "Me and my coworkers started a savings circle to help each other with big expenses. UpCircle keeps us all honest and on track.",
    name: "Marcus T.",
    location: "Texas",
    initials: "MT",
  },
  {
    quote: "The trust score feature is genius. It actually gives people a reason to pay on time. Our group has had zero issues.",
    name: "Amaka O.",
    location: "Maryland",
    initials: "AO",
  },
]

export function Testimonials() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-medium uppercase tracking-wider mb-4">
            People
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy">
            Loved by savers everywhere
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-3xl border-[1.5px] border-card-border p-8 shadow-sm"
            >
              {/* Quote */}
              <blockquote className="text-navy/80 italic leading-relaxed mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <span className="text-navy font-medium text-sm">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-navy">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
