import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ChevronRight, ChevronLeft, RotateCcw, Sprout, Building2 } from 'lucide-react'
import quizData from '../../data/quiz.json'
import type { QuizQuestion, QuizOption } from '../../types'

const QUIZ = quizData as QuizQuestion[]

function calculateFootprint(answers: Record<string, QuizOption>): {
  totalLiters: number
  groundwaterLiters: number
  olympicPools: number
  dailyLiters: number
  agriLiters: number
  urbanLiters: number
} {
  const staple = answers.stapleDiet
  const farm = answers.farmlandScale
  const source = answers.urbanWaterSource
  const bath = answers.bathingHabit
  const wash = answers.washingHabit

  // 1 & 2: Agriculture & Virtual Food Footprint
  const virtualFoodLiters = staple?.virtualWaterLiters ?? 360000
  const farmIrrigation = farm?.farmLitersPerYear ?? 0
  const agriLiters = virtualFoodLiters + farmIrrigation

  // 3, 4 & 5: Urban Direct Household Consumption
  const dailyBathing = bath?.dailyLiters ?? 45
  const dailyWashing = wash?.dailyLiters ?? 30
  const dailyDrinkingKitchen = 35 // Baseline daily drinking, cooking & sanitation
  const totalDailyUrbanLiters = dailyBathing + dailyWashing + dailyDrinkingKitchen

  const gwFraction = source?.groundwaterFraction ?? 0.60
  const annualUrbanDirect = Math.round(totalDailyUrbanLiters * 365 * gwFraction)
  const urbanLiters = annualUrbanDirect

  const groundwaterLiters = Math.round(agriLiters + urbanLiters)
  const totalLiters = groundwaterLiters
  const olympicPools = parseFloat((groundwaterLiters / 2_500_000).toFixed(2))
  const dailyLiters = Math.round(groundwaterLiters / 365)

  return { totalLiters, groundwaterLiters, olympicPools, dailyLiters, agriLiters, urbanLiters }
}

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

export function WaterFootprint() {
  const [step, setStep] = useState(0) // 0..4 = questions, 5 = result
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({})
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const currentQ = QUIZ[step]
  const isResult = step === QUIZ.length

  const handleNext = () => {
    if (!selectedOption) return
    const newAnswers = { ...answers, [currentQ.id]: selectedOption }
    setAnswers(newAnswers)
    setSelectedOption(null)
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1))
    setSelectedOption(null)
  }

  const handleReset = () => {
    setStep(0)
    setAnswers({})
    setSelectedOption(null)
  }

  const result = isResult ? calculateFootprint(answers) : null

  const handleDownload = useCallback(async () => {
    if (!resultRef.current) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#0d3d4a',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = 'my-water-footprint-bhujal-bank.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [])

  return (
    <section id="footprint" className="py-20 px-4 bg-[var(--bg-secondary)]" style={{ scrollMarginTop: '5rem' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[var(--color-aqua)] text-sm font-semibold uppercase tracking-wider">
            Interactive Quiz
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 mb-3">
            My Groundwater Footprint
          </h2>
          <p className="text-[var(--text-secondary)]">
            5 quick questions: 2 agricultural + 3 urban lifestyle habits — see how much groundwater you withdraw each year.
          </p>
        </motion.div>

        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl">
          {!isResult ? (
            <>
              {/* Progress bar */}
              <div className="h-2 bg-[var(--border-color)]">
                <motion.div
                  className="h-full bg-[var(--color-aqua)]"
                  initial={false}
                  animate={{ width: `${(step / QUIZ.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6 sm:p-8">
                {/* Header: Category Badge + Counter */}
                <div className="flex items-center justify-between mb-4">
                  {currentQ.category === 'agriculture' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Sprout size={13} />
                      Agricultural & Food Footprint
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <Building2 size={13} />
                      Urban & Household Footprint
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    Question {step + 1} of {QUIZ.length}
                  </span>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-5">
                      {currentQ.question}
                    </h3>
                    <div className="space-y-2.5" role="group" aria-labelledby={`q-${step}`}>
                      {currentQ.options.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm transition-all duration-150 cursor-pointer ${
                            selectedOption?.value === opt.value
                              ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/10 text-[var(--text-primary)] ring-1 ring-[var(--color-aqua)]'
                              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--color-aqua)]/60 hover:bg-[var(--color-aqua)]/5'
                          }`}
                          aria-pressed={selectedOption?.value === opt.value}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                                selectedOption?.value === opt.value
                                  ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]'
                                  : 'border-[var(--text-muted)]'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="font-medium">{opt.label}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-[var(--border-color)]">
                  <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] disabled:opacity-30 hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className="inline-flex items-center gap-1.5 bg-[var(--color-aqua)] disabled:opacity-40 text-[var(--color-teal-deep)] font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105 disabled:hover:scale-100 shadow-md cursor-pointer disabled:cursor-not-allowed"
                  >
                    {step === QUIZ.length - 1 ? 'Calculate My Footprint' : 'Next Question'}
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Result */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8"
            >
              {/* Downloadable result card */}
              <div
                ref={resultRef}
                className="rounded-3xl p-6 sm:p-8 text-center mb-6 shadow-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #071e26 0%, #0d3d4a 60%, #1a7a8a 100%)' }}
              >
                {/* LPU Logo inside card */}
                <div className="flex justify-center mb-3">
                  <div className="bg-white px-3 py-1 rounded-full inline-flex items-center shadow-md">
                    <img src="/lpu-logo.png" alt="LPU Logo" className="h-5 w-auto object-contain" />
                  </div>
                </div>

                <div className="text-3xl mb-1" aria-hidden="true">💧</div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  My Groundwater Balance Statement
                </h3>
                <p className="text-xs uppercase tracking-widest text-cyan-300 font-semibold mt-1">
                  Annual Water Account Withdrawal
                </p>

                {/* Big Number */}
                <div className="my-4">
                  <span className="text-5xl sm:text-6xl font-bold font-heading text-[var(--color-aqua)] tracking-tight">
                    {formatLargeNumber(result!.groundwaterLiters)}
                  </span>
                  <span className="block text-white/70 text-sm mt-1">litres of groundwater withdrawn / year</span>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-left my-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-1">
                      <Sprout size={14} />
                      <span>Agri & Food Sink</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {formatLargeNumber(result!.agriLiters)} L/yr
                    </p>
                    <p className="text-[10px] text-white/60 leading-tight mt-0.5">Crop virtual water & irrigation</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-1">
                      <Building2 size={14} />
                      <span>Urban Domestic</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {formatLargeNumber(result!.urbanLiters)} L/yr
                    </p>
                    <p className="text-[10px] text-white/60 leading-tight mt-0.5">Baths, washing & household taps</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
                    <p className="text-xs text-white/60">Daily Equivalent</p>
                    <p className="text-base sm:text-lg font-bold text-white">{result!.dailyLiters.toLocaleString()} L</p>
                    <p className="text-[10px] text-white/60 mt-0.5">Average withdrawn per day</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
                    <p className="text-xs text-white/60">Olympic Pools</p>
                    <p className="text-base sm:text-lg font-bold text-white">{result!.olympicPools}</p>
                    <p className="text-[10px] text-white/60 mt-0.5">2.5 million litres each</p>
                  </div>
                </div>

                <p className="text-white/50 text-[11px] mt-4 pt-3 border-t border-white/15">
                  Bhū-Jal Bank · Lovely Professional University (CHE110) · Pratham Sachdeva, Komara Geethika, Muskan Lanjiwar
                </p>
              </div>

              <p className="text-xs text-[var(--text-muted)] text-center mb-6 max-w-lg mx-auto">
                ⚠️ Estimates include virtual water embedded in staple crops (FAO/CGWB coefficients) combined with urban household borewell and tanker reliance.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--color-aqua)] text-[var(--color-teal-deep)] font-semibold px-6 py-3 rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Download size={16} aria-hidden="true" />
                  Download Share Card
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 border border-[var(--border-color)] text-[var(--text-secondary)] px-6 py-3 rounded-full text-sm hover:border-[var(--color-aqua)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
