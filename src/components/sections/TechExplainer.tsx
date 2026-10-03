import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Satellite, Wifi, Map, Brain, ExternalLink } from 'lucide-react'
import techData from '../../data/technology.json'
import type { TechCard } from '../../types'

const ICON_MAP: Record<string, React.ElementType> = {
  Satellite,
  Wifi,
  Map,
  Brain,
}

function TechCardItem({ card, index }: { card: TechCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = ICON_MAP[card.icon] || Satellite

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--color-aqua)] transition-all duration-300 hover:shadow-lg group"
    >
      <div
        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${card.color}20`, border: `2px solid ${card.color}40` }}
        aria-hidden="true"
      >
        <Icon size={28} style={{ color: card.color }} />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">{card.title}</h3>
            <p className="text-xs text-[var(--text-muted)]">{card.subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{card.description}</p>
        <p className="text-xs text-[var(--text-muted)] italic mb-3">{card.detail}</p>
        <a
          href={card.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: card.color }}
        >
          <ExternalLink size={12} aria-hidden="true" />
          {card.sourceLabel}
        </a>
      </div>
    </motion.div>
  )
}

export function TechExplainer() {
  return (
    <section id="technology" className="py-20 px-4 bg-[var(--bg-primary)]" style={{ scrollMarginTop: '5rem' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[var(--color-aqua)] text-sm font-semibold uppercase tracking-wider">Digital Technology</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 mb-3">
            How We Watch the Water
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            From satellites 500 km above Earth to sensors at the bottom of wells, 
            digital technology is transforming how India monitors its groundwater crisis.
          </p>
        </motion.div>

        {/* Timeline connector line */}
        <div className="relative">
          <div
            className="absolute left-7 top-8 bottom-8 w-0.5 hidden sm:block"
            style={{ background: 'linear-gradient(to bottom, var(--color-aqua), transparent)' }}
            aria-hidden="true"
          />
          <div className="space-y-6">
            {(techData as TechCard[]).map((card, i) => (
              <TechCardItem key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>

        {/* Connecting text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, var(--color-teal-deep)20, var(--color-aqua)10)' }}
        >
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            <strong className="text-[var(--text-primary)]">The data pipeline:</strong> GRACE detects regional water loss → 
            DWLRs pinpoint local well levels → India-WRIS integrates and visualises → 
            AI models forecast future trends — creating a complete digital twin of India's aquifer system.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
