import { MAX_AGE_DAYS, STANDARD_WEIGHTS_GRAMS, type Breed } from '#constants/standard_weights'

export type Schedule = {
  direction: 'slow' | 'fast' | 'on_schedule'
  days: number
  /**
   * True when the Actual Weight is above the last day or below the first day of the Standard Table.
   * Then `days` is only the least the chicken can be off by.
   */
  offTable: boolean
}

/**
 * Says how many days a chicken is slow or fast: its Age minus its Growth Age (the day of the
 * Standard Table that has the same weight), to 2 decimals.
 */
export function evaluateSchedule(breed: Breed, ageDays: number, weightGrams: number): Schedule {
  const table = STANDARD_WEIGHTS_GRAMS[breed]
  if (table[ageDays] === undefined) {
    throw new Error('no standard weight for this age')
  }

  if (weightGrams < table[0]) {
    return { direction: 'slow', days: ageDays, offTable: true }
  }
  if (weightGrams > table[MAX_AGE_DAYS]) {
    return { direction: 'fast', days: MAX_AGE_DAYS - ageDays, offTable: true }
  }

  // The last table day that is not heavier than the chicken, and how far past it the chicken is
  let day = 0
  while (day < MAX_AGE_DAYS && table[day + 1] <= weightGrams) {
    day++
  }
  const gramsPastDay = weightGrams - table[day]
  const gramsPerDay = day === MAX_AGE_DAYS ? 1 : table[day + 1] - table[day]

  // Age minus Growth Age, counted in 1/gramsPerDay of a day so every step is a whole number
  const gap = (ageDays - day) * gramsPerDay - gramsPastDay
  if (gap === 0) {
    return { direction: 'on_schedule', days: 0, offTable: false }
  }

  // Round to hundredths of a day; an exact half goes away from zero
  const hundredths = Math.floor((200 * Math.abs(gap) + gramsPerDay) / (2 * gramsPerDay))

  return { direction: gap > 0 ? 'slow' : 'fast', days: hundredths / 100, offTable: false }
}
