import { Droplets, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[var(--color-teal-deep)] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold text-[var(--color-aqua)] mb-3">
              <Droplets size={24} aria-hidden="true" />
              Bhū-Jal Bank
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              India's Groundwater Bank Account — an interactive awareness project
              presenting groundwater data as a bank balance.
            </p>
            <div className="mt-4">
              <div className="bg-white px-3 py-1.5 rounded-xl inline-flex items-center shadow-md">
                <img
                  src="/lpu-logo.png"
                  alt="Lovely Professional University logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-white mb-3 font-heading">Data Sources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://cgwb.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-[var(--color-aqua)] transition-colors"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  CGWB — Dynamic Ground Water Resources of India, 2025
                </a>
              </li>
              <li>
                <a
                  href="https://indiawris.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-[var(--color-aqua)] transition-colors"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  India-WRIS — Water Resources Information System
                </a>
              </li>
              <li>
                <a
                  href="https://grace.jpl.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-[var(--color-aqua)] transition-colors"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  NASA GRACE / GRACE-FO Satellite Mission
                </a>
              </li>
              <li>
                <a
                  href="https://atalbhujal.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-[var(--color-aqua)] transition-colors"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  Atal Bhujal Yojana
                </a>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="font-semibold text-white mb-3 font-heading">Project Details</h3>
            <div className="text-sm text-white/60 space-y-1">
              <p>Course: <span className="text-white/80">CHE110 — Environmental Studies</span></p>
              <p>Institution: <span className="text-white/80">Lovely Professional University</span></p>
              <div className="mt-3">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1.5">Team</p>
                <p className="text-white/80">Pratham Sachdeva</p>
                <p className="text-white/80">Komara Geethika</p>
                <p className="text-white/80">Muskan Lanjiwar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            All national figures sourced from CGWB 2025 report · State data pending publication
          </p>
        </div>
      </div>
    </footer>
  )
}
