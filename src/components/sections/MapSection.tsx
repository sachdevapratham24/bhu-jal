import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import statesData from '../../data/states.json'
import { getCategory, CategoryPill } from '../ui/CategoryPill'
import type { StateData } from '../../types'
import { StateSidePanel } from '../map/StateSidePanel'

// Lazy-load Leaflet map
const LeafletMap = lazy(() => import('../map/LeafletMap'))

const LEGEND = [
  { category: 'Safe', label: 'Safe (< 70%)', color: '#2d6a4f', bg: '#d8f3dc' },
  { category: 'Semi-Critical', label: 'Semi-Critical (70–90%)', color: '#b5943e', bg: '#fff3cd' },
  { category: 'Critical', label: 'Critical (90–100%)', color: '#c04d00', bg: '#fde8d0' },
  { category: 'Over-Exploited', label: 'Over-Exploited (> 100%)', color: '#a31621', bg: '#ffe0e3' },
  { category: 'Data Pending', label: 'Data Pending', color: '#6b7280', bg: '#f3f4f6' },
]

export function MapSection() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleStateSelect = (stateName: string) => {
    const found = (statesData as StateData[]).find(s => s.state === stateName)
    setSelectedState(found || null)
  }

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleStateSelect(e.target.value)
  }

  return (
    <section id="map" className="py-20 px-4 bg-[var(--bg-primary)]" style={{ scrollMarginTop: '4rem' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[var(--color-aqua)] text-sm font-semibold uppercase tracking-wider">Interactive Map</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 mb-3">
            India's Groundwater Overdraft Map
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            States coloured by CGWB category. Click a state to see its bank statement.
            State-level numerical data will be updated once the CGWB 2025 state-wise tables are published.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-6" role="list" aria-label="Map legend">
          {LEGEND.map(item => (
            <div
              key={item.category}
              className="flex items-center gap-2 text-sm"
              role="listitem"
            >
              <span
                className="w-4 h-4 rounded-sm border border-black/10"
                style={{ background: item.bg, borderColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </div>
          ))}
        </div>

        {/* Keyboard-accessible state dropdown */}
        <div className="max-w-sm mx-auto mb-6">
          <label
            htmlFor="state-select"
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Select a state to inspect & zoom:
          </label>
          <div className="flex gap-2">
            <select
              id="state-select"
              value={selectedState?.state || ''}
              onChange={handleDropdownChange}
              className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)] transition-all"
              aria-label="Select Indian state to view groundwater data"
            >
              <option value="">— Select a State / UT —</option>
              {(statesData as StateData[]).map(s => (
                <option key={s.stateCode} value={s.state}>{s.state}</option>
              ))}
            </select>
            {selectedState && (
              <button
                onClick={() => setSelectedState(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-aqua)] transition-all"
                title="Reset selection"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Data verified notice & zoom tip */}
        <div className="max-w-2xl mx-auto mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40">
          <Info size={16} className="text-[var(--color-aqua)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Interactive Map Tip:</strong> Click directly on any state polygon or pick from the dropdown to automatically <strong>zoom in</strong> and review its full hydrogeological dossier, overdraft category, and agricultural water sinks.
          </p>
        </div>

        {/* Map container */}
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-xl z-0" style={{ height: '520px', isolation: 'isolate' }}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-card)]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-aqua)] mx-auto mb-3" />
                <p className="text-[var(--text-secondary)] text-sm">Loading map…</p>
              </div>
            </div>
          }>
            <LeafletMap
              statesData={statesData as StateData[]}
              selectedState={selectedState}
              onStateSelect={handleStateSelect}
              onResetZoom={() => setSelectedState(null)}
            />
          </Suspense>
        </div>

        {/* State list as accessible alternative */}
        <details className="mt-4 max-w-2xl mx-auto">
          <summary className="text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
            View all states as a list (accessible alternative)
          </summary>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(statesData as StateData[]).map(s => {
              const cat = getCategory(s.stageOfExtractionPct)
              return (
                <button
                  key={s.stateCode}
                  onClick={() => setSelectedState(s)}
                  className="flex items-center justify-between text-left text-xs px-3 py-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/5 transition-all"
                >
                  <span className="text-[var(--text-primary)]">{s.state}</span>
                  <CategoryPill category={cat} size="sm" />
                </button>
              )
            })}
          </div>
        </details>
      </div>

      {/* Side panel / bottom sheet */}
      {selectedState && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedState(null)}
            aria-hidden="true"
          />
          <StateSidePanel
            state={selectedState}
            onClose={() => setSelectedState(null)}
            isMobile={isMobile}
          />
        </>
      )}
    </section>
  )
}
