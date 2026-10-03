export type Category = 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited' | 'Data Pending'

export function getCategory(pct: number | null): Category {
  if (pct === null) return 'Data Pending'
  if (pct < 70) return 'Safe'
  if (pct < 90) return 'Semi-Critical'
  if (pct < 100) return 'Critical'
  return 'Over-Exploited'
}

const categoryConfig: Record<Category, { bg: string; text: string; border: string; icon: string }> = {
  'Safe': {
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    border: 'border-green-700',
    icon: '✓',
  },
  'Semi-Critical': {
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-300',
    border: 'border-yellow-700',
    icon: '⚠',
  },
  'Critical': {
    bg: 'bg-orange-900/30',
    text: 'text-orange-300',
    border: 'border-orange-700',
    icon: '!',
  },
  'Over-Exploited': {
    bg: 'bg-red-900/30',
    text: 'text-red-300',
    border: 'border-red-700',
    icon: '✕',
  },
  'Data Pending': {
    bg: 'bg-gray-800/30',
    text: 'text-gray-400',
    border: 'border-gray-600',
    icon: '?',
  },
}

interface CategoryPillProps {
  category: Category
  size?: 'sm' | 'md'
}

export function CategoryPill({ category, size = 'md' }: CategoryPillProps) {
  const config = categoryConfig[category]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${padding} ${config.bg} ${config.text} ${config.border}`}
      role="status"
      aria-label={`Status: ${category}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {category}
    </span>
  )
}

export function SimBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/40 border border-amber-600 text-amber-300 px-3 py-1 text-xs font-medium">
      <span aria-hidden="true">⚡</span>
      Simulated / Illustrative
    </span>
  )
}

export function DataPendingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800/40 border border-gray-600 text-gray-400 px-2 py-0.5 text-xs font-medium">
      <span aria-hidden="true">⏳</span>
      Data Pending
    </span>
  )
}
