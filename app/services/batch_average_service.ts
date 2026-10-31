/**
 * The Average Weight of a Batch: the total weight divided by the number of chicks, in whole
 * grams. An exact half rounds up. Whole-number maths, so there are no decimal errors.
 */
export function averageWeightGrams(totalGrams: number, chickCount: number) {
  if (chickCount < 1) {
    throw new Error('a batch needs at least 1 chick')
  }

  return Math.floor((2 * totalGrams + chickCount) / (2 * chickCount))
}
