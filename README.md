# Bhū-Jal Bank: India's Groundwater Bank Account

> An interactive awareness project presenting India's groundwater crisis as a bank account.  
> Created for **Lovely Professional University — CHE110: Environmental Studies**  
> **Team:** Pratham Sachdeva · Komara Geethika · Muskan Lanjiwar

---

## 🚀 Quick Start

```bash
# Prerequisites: Node.js 18+ and npm

# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Open http://localhost:5173
```

## 🏗️ Build for Production

```bash
npm run build        # Output to /dist
npm run preview      # Preview the production build locally
```

### Deploy
The `/dist` folder is a fully static site — deploy to:
- **Vercel:** `vercel --prod` or connect Git repo
- **Netlify:** Drag and drop `/dist`, or connect Git repo
- **GitHub Pages:** Copy `/dist` contents to `gh-pages` branch

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← Sticky nav with dark mode toggle
│   │   └── Footer.tsx          ← LPU logo, sources, team credits
│   ├── sections/
│   │   ├── Hero.tsx            ← Animated hero + balance gauge
│   │   ├── MapSection.tsx      ← India choropleth map + side panel
│   │   ├── DayZeroSimulator.tsx← 2-slider projection simulator
│   │   ├── TechExplainer.tsx   ← Scroll story: GRACE, DWLR, GIS, AI
│   │   ├── WaterFootprint.tsx  ← 5-question quiz + share card
│   │   ├── Solutions.tsx       ← Tabbed solutions content
│   │   └── AboutProject.tsx    ← Report accordion (intro → bibliography)
│   ├── map/
│   │   ├── LeafletMap.tsx      ← Lazy-loaded Leaflet choropleth
│   │   └── StateSidePanel.tsx  ← Side panel / bottom sheet
│   └── ui/
│       ├── AnimatedCounter.tsx ← Count-up number animation
│       ├── BalanceGauge.tsx    ← SVG circular arc gauge
│       └── CategoryPill.tsx    ← Status pills + SimBadge + DataPendingBadge
├── context/
│   └── ThemeContext.tsx        ← Dark/light mode provider
├── data/
│   ├── nationalStats.json      ← CGWB 2025 national aggregates
│   ├── states.json             ← State data (fill nulls from CGWB 2025)
│   ├── quiz.json               ← Footprint quiz questions
│   ├── solutions.json          ← 4 solution tabs
│   └── technology.json         ← 4 tech explainer cards
└── types/
    └── index.ts                ← TypeScript interfaces
```

---

## 📊 How to Update Data

### Filling State-Level Data (Priority!)

When CGWB publishes state-wise data from the 2025 report:

1. Open `src/data/states.json`
2. For each state, fill in:
   ```json
   {
     "state": "Punjab",
     "stateCode": "PB",
     "stageOfExtractionPct": 165.3,
     "category": "Over-Exploited",
     "annualRecharge": 21.58,
     "annualExtraction": 35.78,
     "source": "CGWB 2025"
   }
   ```
3. The `category` field is derived automatically in the UI from `stageOfExtractionPct`:
   - `< 70%` → Safe
   - `70–90%` → Semi-Critical  
   - `90–100%` → Critical
   - `> 100%` → Over-Exploited

4. Save the file — Vite hot-reloads in dev mode.

### Updating Social Media Stats

Edit the `SOCIAL_MEDIA` array in `src/components/sections/AboutProject.tsx`.

### Adding LPU Logo

Place your LPU logo at `public/lpu-logo.png`. It appears in the Footer automatically.

---

## 🔢 Data Sources & Numbers

All figures used are real and sourced from official reports:

| Figure | Value | Source |
|--------|-------|--------|
| Annual Recharge | 448.52 BCM | CGWB 2025 |
| Annual Extractable Resources | 407.75 BCM | CGWB 2025 |
| Annual Extraction | 247.22 BCM | CGWB 2025 |
| Stage of Extraction | 60.63% | CGWB 2025 |
| Total Assessment Units | 6,762 | CGWB 2025 |
| Over-Exploited Units | 730 (10.80%) | CGWB 2025 |
| Safe Units | 73.14% | CGWB 2025 |
| Water footprint (paddy) | ~1,400 L/kg | IRRI / FAO |
| Water footprint (millet) | ~300 L/kg | FAO |
| GRACE depletion rate | 17.7 ± 4.5 km³/yr | Rodell et al. 2009 |
| DWLR network | 22,000+ wells | CGWB |
| Atal Bhujal Yojana | ₹6,000 crore, 7 states | MoJS |

**Simulated content** (always labelled):
- Water footprint quiz results (estimated from coefficients)
- Day Zero simulator projections (linear model, not forecast)
- State-level trend charts (illustrative seed-based curves)

---

## 🛠️ Tech Stack

| Tool | Version | Use |
|------|---------|-----|
| Vite | 8.x | Build tool |
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.x | Animations |
| Recharts | 2.x | Charts |
| Leaflet + react-leaflet | 1.x | India map |
| html2canvas | 1.x | Share card export |
| lucide-react | — | Icons |

---

## ♿ Accessibility

- WCAG AA contrast ratios throughout
- All icons have `aria-hidden="true"` or meaningful `aria-label`
- Map has keyboard-accessible dropdown alternative
- Colour is never the sole indicator (icons + labels always present)
- `prefers-reduced-motion` respected (all Framer Motion animations skip)
- Skip-to-main-content link in App.tsx
- Proper `role`, `aria-label`, `aria-controls` on tabs and dialogs

---

## 📄 License

Educational project — all data © their respective sources (CGWB, NASA, India-WRIS).
