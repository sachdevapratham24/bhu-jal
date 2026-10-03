import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingDown, TrendingUp, Minus, Layers, AlertTriangle, ShieldCheck, Sprout, Activity } from 'lucide-react'
import { CategoryPill, DataPendingBadge, getCategory } from '../ui/CategoryPill'
import type { StateData } from '../../types'
import { STATE_FACTS } from '../../data/stateFacts'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

interface StateSidePanelProps {
  state: StateData | null
  onClose: () => void
  isMobile?: boolean
}

function generateMockTrend(seed: number) {
  const data = []
  let value = 10 + (seed % 5)
  for (let year = 2015; year <= 2024; year++) {
    value += (Math.sin(year * seed * 0.3) * 0.3) - 0.15
    data.push({ year, depth: parseFloat(value.toFixed(2)) })
  }
  return data
}

export function StateSidePanel({ state, onClose, isMobile = false }: StateSidePanelProps) {
  if (!state) return null

  const category = getCategory(state.stageOfExtractionPct)
  const hasData = state.stageOfExtractionPct !== null
  const trendData = generateMockTrend(state.state.charCodeAt(0))
  const facts = STATE_FACTS[state.state]

  const panelVariants = isMobile
    ? {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
        exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
        exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
      }

  return (
    <AnimatePresence>
      <motion.div
        key="panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`
          bg-[var(--bg-card)] border-[var(--border-color)] border
          ${isMobile
            ? 'fixed bottom-0 left-0 right-0 rounded-t-3xl z-[60] max-h-[85vh] overflow-y-auto shadow-2xl'
            : 'fixed right-0 top-0 h-full w-[420px] z-[60] overflow-y-auto shadow-2xl'
          }
        `}
        role="dialog"
        aria-label={`Groundwater data and insights for ${state.state}`}
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border-color)] p-4 sm:p-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-heading text-[var(--text-primary)]">{state.state}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] font-mono">
                {state.stateCode}
              </span>
            </div>
            <div className="mt-1">
              <CategoryPill category={category} size="sm" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Bank Statement Card */}
          <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="bg-[var(--color-teal-mid)] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-aqua-light font-semibold uppercase tracking-wider">Bhū-Jal Bank Statement</p>
                <p className="text-white/70 text-xs">{state.state} · CGWB Official Account</p>
              </div>
              <span className="text-xl" aria-hidden="true">🏦</span>
            </div>
            <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {/* Recharge */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" aria-hidden="true" />
                  <span className="text-sm text-[var(--text-secondary)]">Annual Recharge (Deposit)</span>
                </div>
                {hasData && state.annualRecharge ? (
                  <span className="font-bold text-green-400">{state.annualRecharge} BCM</span>
                ) : (
                  <DataPendingBadge />
                )}
              </div>
              {/* Extraction */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} className="text-red-400" aria-hidden="true" />
                  <span className="text-sm text-[var(--text-secondary)]">Annual Extraction (Withdrawal)</span>
                </div>
                {hasData && state.annualExtraction ? (
                  <span className="font-bold text-red-400">{state.annualExtraction} BCM</span>
                ) : (
                  <DataPendingBadge />
                )}
              </div>
              {/* Balance */}
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-2">
                  <Minus size={16} className="text-[var(--color-aqua)]" aria-hidden="true" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Stage of Extraction</span>
                </div>
                {hasData ? (
                  <span className="font-bold text-[var(--color-aqua)]">{state.stageOfExtractionPct?.toFixed(1)}%</span>
                ) : (
                  <DataPendingBadge />
                )}
              </div>
            </div>
          </div>

          {/* Rich State Facts & Hydrogeological Dossier */}
          {facts && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} className="text-[var(--color-aqua)]" />
                  State Hydrogeological Dossier
                </h3>
                {facts.atalBhujal && (
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">
                    ✓ Atal Bhujal Yojana
                  </span>
                )}
              </div>

              {/* Key Insight Highlight */}
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-aqua)] mb-1.5">
                  Ground Reality & Extraction Drivers
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {facts.keyFact}
                </p>
              </div>

              {/* Aquifer & Dominant Crops */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start gap-3">
                  <Layers size={18} className="text-[var(--color-aqua)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Aquifer Formation</p>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-0.5">{facts.aquiferType}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start gap-3">
                  <Sprout size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Major Agricultural Water Consumers</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {facts.dominantCrops.map((crop) => (
                        <span key={crop} className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vulnerability & Policy */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  <AlertTriangle size={15} />
                  <span>Key Environmental Vulnerability</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {facts.vulnerability}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start gap-3">
                <ShieldCheck size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium">Local Water Conservation Initiative</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{facts.localInitiative}</p>
                </div>
              </div>
            </div>
          )}

          {/* Trend chart (illustrative) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[var(--text-primary)]">10-Year Water Table Trend</p>
              <span className="text-xs text-amber-400 bg-amber-900/30 border border-amber-700 rounded-full px-2 py-0.5">
                Simulated Trend
              </span>
            </div>
            <div className="h-32 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis reversed tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="depth" stroke="#00b4d8" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              Depth to water table (m) · Negative slope indicates aquifer mining
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
