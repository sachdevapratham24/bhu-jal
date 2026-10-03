import { motion } from 'framer-motion'
import { ArrowDown, Map, CheckCircle } from 'lucide-react'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { BalanceGauge } from '../ui/BalanceGauge'
import { GroundwaterIllustration } from '../ui/GroundwaterIllustration'
import nationalStats from '../../data/nationalStats.json'

function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          className="absolute bottom-0 w-full"
          style={{
            height: `${120 + i * 30}px`,
            opacity: 0.08 + i * 0.04,
            animation: `wave ${8 + i * 2}s ease-in-out ${i * 0.8}s infinite alternate`,
          }}
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d={`M0,${80 + i * 10} C360,${140 - i * 15} 720,${30 + i * 10} 1080,${100 + i * 5} S1440,${60 + i * 10} 1440,${80 + i * 10} L1440,200 L0,200 Z`}
            fill="#00b4d8"
          />
        </svg>
      ))}
      <style>{`
        @keyframes wave {
          0% { transform: translateX(-20px) scaleX(1.02); }
          100% { transform: translateX(20px) scaleX(0.98); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg[style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

function StatCard({
  label,
  value,
  suffix,
  sublabel,
  color,
  icon,
}: {
  label: string
  value: number
  suffix: string
  sublabel: string
  color: string
  icon: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 flex flex-col items-center text-center min-w-[160px]"
    >
      <span className="text-2xl mb-1" aria-hidden="true">{icon}</span>
      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-heading ${color}`}>
        <AnimatedCounter end={value} decimals={2} suffix={` ${suffix}`} />
      </p>
      <p className="text-xs text-white/50 mt-1">{sublabel}</p>
    </motion.div>
  )
}

export function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 64
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden pt-24 pb-16"
      style={{
        background: 'linear-gradient(160deg, #071e26 0%, #0d3d4a 40%, #1a7a8a 100%)',
        scrollMarginTop: '5rem',
      }}
    >
      <WaveBackground />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-1.5 text-sm mb-6"
          style={{ color: '#90e0ef' }}
        >
          <div className="bg-white px-2 py-0.5 rounded-full inline-flex items-center shadow-sm">
            <img src="/lpu-logo.png" alt="LPU Logo" className="h-4 w-auto object-contain" />
          </div>
          <span className="text-xs sm:text-sm font-medium">CGWB 2025 · CHE110 · Lovely Professional University</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
        >
          India is{' '}
          <span className="text-gradient">overdrawing</span>
          <br />
          its water bank.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Every year, India withdraws more groundwater than nature can replenish.
          The account is running low — and{' '}
          <strong className="text-white">{nationalStats.overExploitedPct}%</strong> of
          assessment units are already over-exploited.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <StatCard
            label="Annual Recharge"
            value={nationalStats.annualRecharge}
            suffix="BCM"
            sublabel="Deposits into the aquifer"
            color="text-green-400"
            icon="💧"
          />
          <div className="flex items-center justify-center">
            <BalanceGauge
              percentage={nationalStats.stageOfExtractionPct}
              size={180}
              label="Stage of Extraction"
            />
          </div>
          <StatCard
            label="Annual Extraction"
            value={nationalStats.annualExtraction}
            suffix="BCM"
            sublabel="Withdrawals from the aquifer"
            color="text-red-400"
            icon="⬇️"
          />
        </motion.div>

        {/* Groundwater illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-4"
        >
          <GroundwaterIllustration />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => scrollToSection('#map')}
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: '#00b4d8', color: '#0d3d4a' }}
          >
            <Map size={18} aria-hidden="true" />
            Explore the Map
          </button>
          <button
            onClick={() => {
              scrollToSection('#map')
              setTimeout(() => (document.querySelector('#state-select') as HTMLElement)?.focus(), 800)
            }}
            className="inline-flex items-center gap-2 glass border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:bg-white/15"
          >
            <CheckCircle size={18} aria-hidden="true" />
            Check Your State
          </button>
        </motion.div>

        {/* CGWB source note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-xs text-white/40"
        >
          Source: CGWB Dynamic Ground Water Resources of India, 2025 · All figures in BCM (Billion Cubic Metres)
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={24} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
