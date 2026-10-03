import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { MapSection } from './components/sections/MapSection'
import { DayZeroSimulator } from './components/sections/DayZeroSimulator'
import { TechExplainer } from './components/sections/TechExplainer'
import { WaterFootprint } from './components/sections/WaterFootprint'
import { Solutions } from './components/sections/Solutions'
import { AboutProject } from './components/sections/AboutProject'

function App() {
  return (
    <ThemeProvider>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-aqua)] focus:text-[var(--color-teal-deep)] focus:px-4 focus:py-2 focus:rounded-full focus:font-semibold"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <MapSection />
        <DayZeroSimulator />
        <TechExplainer />
        <WaterFootprint />
        <Solutions />
        <AboutProject />
      </main>
      <Footer />
    </ThemeProvider>
  )
}

export default App
