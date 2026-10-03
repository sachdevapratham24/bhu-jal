import { motion } from 'framer-motion'
import { GraduationCap, Users, Database, Share2, BookOpen, ExternalLink } from 'lucide-react'

const TEAM_MEMBERS = [
  { name: 'Pratham Sachdeva', role: 'Project Lead & Development', initial: 'P' },
  { name: 'Komara Geethika', role: 'Research & Data Analysis', initial: 'K' },
  { name: 'Muskan Lanjiwar', role: 'Environmental Policy & Design', initial: 'M' },
]

const KEY_SOURCES = [
  {
    title: 'CGWB Dynamic Ground Water Resources of India (2022 & 2025)',
    org: 'Central Ground Water Board, Ministry of Jal Shakti',
    url: 'https://cgwb.gov.in/',
  },
  {
    title: 'India-WRIS (Water Resources Information System)',
    org: 'National Water Informatics Centre (NWIC)',
    url: 'https://indiawris.gov.in/',
  },
  {
    title: 'NASA GRACE / GRACE-FO Satellite Mission',
    org: 'NASA Jet Propulsion Laboratory & DLR',
    url: 'https://grace.jpl.nasa.gov/',
  },
]

const SOCIAL_CHANNELS = [
  { platform: 'Instagram', handle: '@bhujal_bank', status: 'Live Campaign' },
  { platform: 'YouTube', handle: 'Bhū-Jal Bank Project', status: 'Video Explainer' },
  { platform: 'X / Twitter', handle: '@bhujalbank', status: 'Updates & Stats' },
]

export function AboutProject() {
  return (
    <section id="about" className="py-20 px-4 bg-[var(--bg-secondary)]" style={{ scrollMarginTop: '5rem' }}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[var(--color-aqua)] text-sm font-semibold uppercase tracking-wider">
            University Project
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 mb-3">
            About Bhū-Jal Bank
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Monitoring groundwater depletion in India using digital technology — an educational initiative for CHE110 Environmental Studies at Lovely Professional University.
          </p>
        </motion.div>

        {/* Unified Clean Container */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 shadow-xl space-y-10">
          {/* 1. Core Concept */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-aqua)]/15 flex items-center justify-center text-[var(--color-aqua)]">
                <BookOpen size={20} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text-primary)]">
                Project Overview & The Bank Account Metaphor
              </h3>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              Groundwater sustains over 60% of India's agricultural irrigation and 85% of rural drinking water supplies. 
              Yet, excessive extraction has pushed hundreds of administrative assessment units into critical and over-exploited stages.
              <strong> Bhū-Jal Bank</strong> translates complex hydrogeological datasets into an intuitive financial metaphor:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                <span className="text-2xl mb-1 block">🌧️</span>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Deposits</p>
                <p className="font-bold text-green-400 mt-1">Annual Recharge</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Monsoon percolation & surface water bodies</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                <span className="text-2xl mb-1 block">🚜</span>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Withdrawals</p>
                <p className="font-bold text-red-400 mt-1">Annual Extraction</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Pumping for agriculture, industry & domestic use</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                <span className="text-2xl mb-1 block">📊</span>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Balance</p>
                <p className="font-bold text-[var(--color-aqua)] mt-1">Water Table Level</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Aquifer depth measured in metres below ground</p>
              </div>
            </div>
          </div>

          {/* 2. Course & Academic Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-heading font-bold text-lg">
                <GraduationCap size={20} className="text-[var(--color-aqua)]" aria-hidden="true" />
                <h4>Academic Details</h4>
              </div>
              <div className="text-sm text-[var(--text-secondary)] space-y-3 bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)]">
                <div className="bg-white p-2.5 rounded-xl inline-flex items-center shadow-sm border border-black/5">
                  <img src="/lpu-logo.png" alt="Lovely Professional University" className="h-8 w-auto object-contain" />
                </div>
                <div className="space-y-1.5">
                  <p><strong className="text-[var(--text-primary)]">Course:</strong> CHE110 — Environmental Studies</p>
                  <p><strong className="text-[var(--text-primary)]">Topic:</strong> Monitoring of Groundwater Depletion using Digital Technology</p>
                  <p><strong className="text-[var(--text-primary)]">Institution:</strong> Lovely Professional University (LPU), Punjab, India</p>
                  <p><strong className="text-[var(--text-primary)]">Focus:</strong> Bridging scientific monitoring (GRACE satellites, IoT telemetry, GIS) and public awareness</p>
                </div>
              </div>
            </div>

            {/* Social Media Campaign Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-heading font-bold text-lg">
                <Share2 size={20} className="text-[var(--color-aqua)]" aria-hidden="true" />
                <h4>Awareness Campaign Status</h4>
              </div>
              <div className="space-y-2">
                {SOCIAL_CHANNELS.map((item) => (
                  <div
                    key={item.platform}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm"
                  >
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">{item.platform}</span>
                      <span className="text-xs text-[var(--color-aqua)] ml-2">{item.handle}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-aqua/10 text-[var(--color-aqua)] border border-[var(--color-aqua)]/30 font-medium">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Team Members */}
          <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-heading font-bold text-lg">
              <Users size={20} className="text-[var(--color-aqua)]" aria-hidden="true" />
              <h4>Project Team</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-aqua)]/20 text-[var(--color-aqua)] font-bold text-lg flex items-center justify-center mb-3">
                    {member.initial}
                  </div>
                  <h5 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">{member.name}</h5>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Verified Sources & Bibliography */}
          <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-heading font-bold text-lg">
              <Database size={20} className="text-[var(--color-aqua)]" aria-hidden="true" />
              <h4>Authoritative Data Sources</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {KEY_SOURCES.map((source) => (
                <a
                  key={source.title}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--color-aqua)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs text-[var(--color-aqua)] font-semibold">Official Data</span>
                      <ExternalLink size={12} className="text-[var(--text-muted)] group-hover:text-[var(--color-aqua)] transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{source.title}</p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">{source.org}</p>
                </a>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center pt-2">
              National figures extracted from CGWB 2025 assessment report · State-wise hydrogeological data aligned with CGWB Dynamic Ground Water Resources
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
