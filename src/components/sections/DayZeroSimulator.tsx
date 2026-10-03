import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import statesData from '../../data/states.json'
import nationalStats from '../../data/nationalStats.json'
import { SimBadge, DataPendingBadge } from '../ui/CategoryPill'
import type { StateData } from '../../types'

const YEARS = Array.from({ length: 11 }, (_, i) => 2025 + i)

function projectWaterTable(
  baseExtractionPct: number,
  extractionChange: number,
  rainfallChange: number
): { year: number; depth: number; extraction: number; recharge: number }[] {
  // Simple linear model:
  // balance(t) = balance(0) + t × (recharge × (1 + rainfallChange/100) − extraction × (1 + extractionChange/100))
  // depth(t) = depth(0) + deficit(t) × 0.3  (0.3 m per BCM deficit per year, illustrative)
  const baseDepth = 8 + (baseExtractionPct / 100) * 5
  const baseRecharge = nationalStats.annualRecharge
  const baseExtraction = nationalStats.annualExtraction * (baseExtractionPct / nationalStats.stageOfExtractionPct)

  return YEARS.map((year, t) => {
    const recharge = baseRecharge * (1 + rainfallChange / 100)
    const extraction = baseExtraction * (1 + extractionChange / 100)
    const deficit = extraction - recharge
    const depth = baseDepth + t * deficit * 0.003
    return {
      year,
      depth: parseFloat(depth.toFixed(2)),
      extraction: parseFloat(extraction.toFixed(2)),
      recharge: parseFloat(recharge.toFixed(2)),
    }
  })
}

export function DayZeroSimulator() {
  const [selectedStateName, setSelectedStateName] = useState<string>('')
  const [extractionChange, setExtractionChange] = useState(0)
  const [rainfallChange, setRainfallChange] = useState(0)

  const selectedState = useMemo(
    () => (statesData as StateData[]).find(s => s.state === selectedStateName),
    [selectedStateName]
  )

  const basePct = selectedState?.stageOfExtractionPct ?? nationalStats.stageOfExtractionPct

  const projectionData = useMemo(
    () => projectWaterTable(basePct, extractionChange, rainfallChange),
    [basePct, extractionChange, rainfallChange]
  )

  const finalDepth = projectionData[projectionData.length - 1].depth
  const initialDepth = projectionData[0].depth
  const trend = finalDepth > initialDepth ? 'depleting' : finalDepth < initialDepth ? 'recovering' : 'stable'

  const trendColors = {
    depleting: '#e63946',
    recovering: '#2d6a4f',
    stable: '#00b4d8',
  }

  return (
    <section id="simulator" className="py-20 px-4 bg-[var(--bg-secondary)]" style={{ scrollMarginTop: '4rem' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[var(--color-aqua)] text-sm font-semibold uppercase tracking-wider">Simulator</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 mb-3">
            Day Zero Simulator
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Drag the sliders to see how changes in extraction or rainfall
            might affect the water table over 10 years.
          </p>
          <div className="flex justify-center mt-3 gap-2">
            <SimBadge />
            <span className="text-xs text-[var(--text-muted)] flex items-center">
              ⚠️ Simple educational model — not a scientific forecast
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Controls */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] space-y-6">
            {/* State picker */}
            <div>
              <label htmlFor="sim-state" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Select State / Region
              </label>
              <select
                id="sim-state"
                value={selectedStateName}
                onChange={e => setSelectedStateName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]"
              >
                <option value="">National Average</option>
                {(statesData as StateData[]).map(s => (
                  <option key={s.stateCode} value={s.state}>{s.state}</option>
                ))}
              </select>
              {selectedState && selectedState.stageOfExtractionPct === null && (
                <div className="mt-2 flex items-center gap-1.5">
                  <DataPendingBadge />
                  <span className="text-xs text-[var(--text-muted)]">Using national average as base</span>
                </div>
              )}
            </div>

            {/* Extraction slider */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label htmlFor="extraction-slider" className="text-sm font-semibold text-[var(--text-primary)]">
                  Extraction Change
                </label>
                <span className={`text-sm font-bold ${extractionChange > 0 ? 'text-red-400' : extractionChange < 0 ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                  {extractionChange > 0 ? '+' : ''}{extractionChange}%
                </span>
              </div>
              <input
                id="extraction-slider"
                type="range"
                min={-50}
                max={50}
                step={5}
                value={extractionChange}
                onChange={e => setExtractionChange(Number(e.target.value))}
                className="w-full accent-[var(--color-aqua)]"
                aria-label={`Extraction change: ${extractionChange}%`}
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>−50% (less pumping)</span>
                <span>+50% (more pumping)</span>
              </div>
            </div>

            {/* Rainfall slider */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label htmlFor="rainfall-slider" className="text-sm font-semibold text-[var(--text-primary)]">
                  Rainfall Change
                </label>
                <span className={`text-sm font-bold ${rainfallChange > 0 ? 'text-green-400' : rainfallChange < 0 ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
                  {rainfallChange > 0 ? '+' : ''}{rainfallChange}%
                </span>
              </div>
              <input
                id="rainfall-slider"
                type="range"
                min={-50}
                max={50}
                step={5}
                value={rainfallChange}
                onChange={e => setRainfallChange(Number(e.target.value))}
                className="w-full accent-[var(--color-aqua)]"
                aria-label={`Rainfall change: ${rainfallChange}%`}
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>−50% (drought)</span>
                <span>+50% (more rain)</span>
              </div>
            </div>

            {/* Trend summary */}
            <div
              className="rounded-xl p-4 border text-center"
              style={{
                background: `${trendColors[trend]}15`,
                borderColor: `${trendColors[trend]}50`,
              }}
            >
              <p className="text-sm font-semibold" style={{ color: trendColors[trend] }}>
                {trend === 'depleting' && '⬇️ Water table is falling'}
                {trend === 'recovering' && '⬆️ Water table is recovering'}
                {trend === 'stable' && '↔️ Water table is stable'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Projected depth in 2035: <strong>{finalDepth.toFixed(1)} m</strong> (vs {initialDepth.toFixed(1)} m today)
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Projected Water Table Depth (2025–2035)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  />
                  <YAxis
                    reversed
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--text-muted)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => val != null ? [`${Number(val).toFixed(1)} m`, 'Depth to water table'] : ['-', 'Depth to water table']}
                  />
                  <ReferenceLine y={initialDepth} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '2025 baseline', fontSize: 10, fill: '#94a3b8' }} />
                  <Line
                    type="monotone"
                    dataKey="depth"
                    stroke={trendColors[trend]}
                    strokeWidth={3}
                    dot={{ fill: trendColors[trend], r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">
              <strong>Model:</strong> Linear projection using national recharge/extraction averages adjusted by slider values.
              Actual aquifer behaviour is non-linear and depends on geology, monsoon variability, and policy.
              This chart is for educational illustration only.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
