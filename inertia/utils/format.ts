import type { Data } from '@generated/data'

export type Status = Data.Weighing['status']

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
