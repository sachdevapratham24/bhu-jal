export interface StateData {
  state: string
  stateCode: string
  stageOfExtractionPct: number | null
  category: string | null
  annualRecharge: number | null
  annualExtraction: number | null
  source: string
}

export interface NationalStats {
  annualRecharge: number
  annualExtractable: number
  annualExtraction: number
  stageOfExtractionPct: number
  totalAssessmentUnits: number
  overExploitedUnits: number
  overExploitedPct: number
  safeUnitsPct: number
  source: string
  reportYear: number
}

export interface QuizQuestion {
  id: string
  question: string
  category?: 'agriculture' | 'urban'
  options: QuizOption[]
}

export interface QuizOption {
  label: string
  value: string
  litersPerYear?: number
  multiplier?: number
  litersPerDay?: number
  dailyLiters?: number
  farmLitersPerYear?: number
  groundwaterFraction?: number
  virtualWaterLiters?: number
}

export interface Solution {
  id: string
  title: string
  icon: string
  description: string
  stat: string
  impact: string
  link: string
  linkLabel: string
}

export interface TechCard {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  description: string
  detail: string
  source: string
  sourceLabel: string
}
