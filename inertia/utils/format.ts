import type { Data } from '@generated/data'

export type Status = Data.Weighing['status']
export type Schedule = Data.Weighing['schedule']

export const STATUS_LABELS: Record<Status, string> = {
  ahead: 'Ahead',
  on_track: 'On track',
  slightly_behind: 'Slightly behind',
  behind: 'Behind',
}

/**
 * The gauge runs from -15% to +10% of the standard weight.
 */
const GAUGE_MIN = -15
const GAUGE_MAX = 10

export function kg(grams: number) {
  return (grams / 1000).toFixed(3)
}

export function signedPercent(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}

/**
 * Where the marker sits on the gauge, as a percentage from the left edge.
 */
export function gaugePosition(gapPercent: number) {
  const clamped = Math.min(GAUGE_MAX, Math.max(GAUGE_MIN, gapPercent))
  return ((clamped - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100
}

export function shortDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`)
  const sameYear = date.getFullYear() === new Date().getFullYear()

  return date.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  })
}

/**
 * Says how many days slow or fast a weighing is, in words.
 * 2 decimals at most, and no needless zeros: 2, 3.94, 0.01.
 */
export function scheduleText({ direction, days, offTable }: Schedule) {
  if (direction === 'on_schedule') return 'On schedule'

  const unit = days === 1 ? 'day' : 'days'

  if (offTable) {
    if (days === 0) return direction === 'fast' ? 'Ahead of the table' : 'Behind the table'
    return `At least ${days} ${unit} ${direction} (off the table)`
  }

  return `${days} ${unit} ${direction}`
}

/**
 * Average Weight of a batch in whole grams, worked out the same way as on the server
 * (an exact half rounds up). The server does the real calculation; this is only the
 * live "Average per chick" line on the form.
 */
export function averageGrams(totalGrams: number, chickCount: number) {
  return Math.floor((2 * totalGrams + chickCount) / (2 * chickCount))
}
