"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Is UpCircle free to use?",
    answer: "Yes — completely free during our launch period. The core savings circle experience will always be free.",
  },
  {
    question: "Who can use UpCircle?",
    answer: "Anyone! Friends, families, coworkers, students, or any community group that wants to save together.",
  },
  {
    question: "Does real money move through the app?",
    answer: "Not yet. UpCircle handles coordination, tracking, and trust scoring. Members transfer funds directly to each other using their preferred payment method.",
  },
  {
    question: "How does the trust score work?",
    answer: "Your trust score increases when you make on-time contributions and decreases when you miss payments. It helps circle organizers identify reliable members.",
  },
  {
    question: "Can I be part of multiple circles?",
    answer: "Absolutely! You can join or create as many circles as you want. Many users participate in circles with different groups — friends, family, and coworkers.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-medium uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy">
            Common questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border-[1.5px] border-card-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-cream/50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-navy pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gold shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
