import { test } from '@japa/runner'
import { evaluateWeighing } from '#services/weight_status_service'

test.group('Weight status service', () => {
  test('on track when weight equals standard', ({ assert }) => {
    const result = evaluateWeighing('ross', 21, 1012)

    assert.deepEqual(result, {
      standardGrams: 1012,
      gapGrams: 0,
      gapPercent: 0,
      status: 'on_track',
    })
  })

  test('slightly behind at -6.1%', ({ assert }) => {
    const result = evaluateWeighing('ross', 21, 950)

    assert.deepEqual(result, {
      standardGrams: 1012,
      gapGrams: -62,
      gapPercent: -6.1,
      status: 'slightly_behind',
    })
  })

  test('behind below -10%', ({ assert }) => {
    const result = evaluateWeighing('cobb', 35, 2100)

    assert.deepEqual(result, {
      standardGrams: 2521,
      gapGrams: -421,
      gapPercent: -16.7,
      status: 'behind',
    })
  })

  test('ahead at +6.3%', ({ assert }) => {
    const result = evaluateWeighing('aa_plus', 14, 560)

    assert.deepEqual(result, {
      standardGrams: 527,
      gapGrams: 33,
      gapPercent: 6.3,
      status: 'ahead',
    })
  })

  test('exactly -10.0% is slightly behind, not behind', ({ assert }) => {
    const result = evaluateWeighing('cobb', 10, 297)

    assert.deepEqual(result, {
      standardGrams: 330,
      gapGrams: -33,
      gapPercent: -10,
      status: 'slightly_behind',
    })
  })

  test('rounds an exact half away from zero (-6.25% shows -6.3)', ({ assert }) => {
    const result = evaluateWeighing('ross', 9, 270)

    assert.deepEqual(result, {
      standardGrams: 288,
      gapGrams: -18,
      gapPercent: -6.3,
      status: 'slightly_behind',
    })
  })

  test('shows 0 percent, not minus zero, for a tiny gap below standard', ({ assert }) => {
    const result = evaluateWeighing('ross', 44, 3196)

    assert.deepEqual(result, {
      standardGrams: 3197,
      gapGrams: -1,
      gapPercent: 0,
      status: 'on_track',
    })
  })

  test('has no standard for age 45', ({ assert }) => {
    assert.throws(() => evaluateWeighing('ross', 45, 2500), 'no standard weight for this age')
  })
})
