const communities = [
  { emoji: "🤝", label: "Friends", description: "Save with your closest people" },
  { emoji: "👨‍👩‍👧", label: "Families", description: "Build generational wealth together" },
  { emoji: "💼", label: "Coworkers", description: "Office savings made easy" },
  { emoji: "🎓", label: "Students", description: "Start your savings journey early" },
]

export function CommunityStrip() {
  return (
    <section id="community" className="bg-navy border-b-2 border-gold/30 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-white/80 text-lg mb-10">
          One platform, every community
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {communities.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center group">
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.emoji}</span>
              <span className="text-gold font-medium text-sm mb-1">{item.label}</span>
              <span className="text-white/50 text-xs leading-tight">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
