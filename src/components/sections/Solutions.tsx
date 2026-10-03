import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudRain, Droplets, Leaf, Building2, ExternalLink } from 'lucide-react'
import solutionsData from '../../data/solutions.json'
import type { Solution } from '../../types'

const ICON_MAP: Record<string, React.ElementType> = {
  CloudRain,
  Droplets,
  Leaf,
  Building2,
}

export function Solutions() {
  const [activeTab, setActiveTab] = useState(0)
  const solutions = solutionsData as Solution[]
  const active = solutions[activeTab]
  const ActiveIcon = ICON_MAP[active.icon] || Droplets

  return (
    <section id="solutions" className="py-20 px-4 bg-[var(--bg-primary)]" style={{ scrollMarginTop: '5rem' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[var(--color-aqua)] text-sm font-semibold uppercase tracking-wider">Action</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 mb-3">
            Why It Matters & What Can Be Done
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            India's groundwater crisis is serious — but it is not irreversible. 
            Here are proven, scalable solutions.
          </p>
        </motion.div>

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-8"
          role="tablist"
          aria-label="Solutions categories"
        >
          {solutions.map((sol, i) => {
            const Icon = ICON_MAP[sol.icon] || Droplets
            return (
              <button
                key={sol.id}
                role="tab"
                aria-selected={activeTab === i}
                aria-controls={`tab-panel-${sol.id}`}
                id={`tab-${sol.id}`}
                onClick={() => setActiveTab(i)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeTab === i
                    ? 'bg-[var(--color-aqua)] border-[var(--color-aqua)] text-[var(--color-teal-deep)]'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--color-aqua)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                {sol.title}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="tabpanel"
            id={`tab-panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
          >
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-lg">
              {/* Header */}
              <div
                className="px-6 py-5 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, var(--color-teal-mid), var(--color-teal-light))' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <ActiveIcon size={24} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">{active.title}</h3>
                  <p className="text-white/70 text-sm">{active.stat}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">How It Works</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{active.description}</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">Impact</p>
                    <p className="font-semibold text-[var(--text-primary)] text-sm">{active.impact}</p>
                  </div>
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--color-aqua)] text-sm font-semibold hover:underline transition-colors"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    {active.linkLabel}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center p-6 rounded-2xl border border-[var(--color-aqua)]/30 bg-[var(--color-aqua)]/5"
        >
          <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">
            Every drop counts — and so does every voice.
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Share your water footprint result to raise awareness among your friends and family.
          </p>
          <button
            onClick={() => document.querySelector('#footprint')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-[var(--color-aqua)] text-[var(--color-teal-deep)] font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition-all"
          >
            💧 Take the Footprint Quiz
          </button>
        </motion.div>
      </div>
    </section>
  )
}
