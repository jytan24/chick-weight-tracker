import { STANDARD_WEIGHTS_GRAMS, type Breed } from '#constants/standard_weights'

export type Status = 'ahead' | 'on_track' | 'slightly_behind' | 'behind'

export type WeighingEvaluation = {
  standardGrams: number
  gapGrams: number
  gapPercent: number
  status: Status
}

export function evaluateWeighing(
  breed: Breed,
  ageDays: number,
  weightGrams: number
): WeighingEvaluation {
  const standardGrams = STANDARD_WEIGHTS_GRAMS[breed][ageDays]
  if (standardGrams === undefined) {
    throw new Error('no standard weight for this age')
  }

  const gapGrams = weightGrams - standardGrams
  const gapTenthsOfPercent = Math.round(Math.abs(gapGrams * 1000) / standardGrams)
  const gapPercent = gapTenthsOfPercent === 0 ? 0 : (Math.sign(gapGrams) * gapTenthsOfPercent) / 10

  let status: Status = 'on_track'
  if (gapPercent >= 5) {
    status = 'ahead'
  } else if (gapPercent < -10) {
    status = 'behind'
  } else if (gapPercent < -5) {
    status = 'slightly_behind'
  }

  return { standardGrams, gapGrams, gapPercent, status }
}
