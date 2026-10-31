import { test } from '@japa/runner'
import { BREEDS, STANDARD_WEIGHTS_GRAMS } from '#constants/standard_weights'
import { evaluateSchedule } from '#services/growth_schedule_service'

test.group('Growth schedule service', () => {
  test('slow by whole days: Ross day 20 at 0.789 kg is the weight of day 18', ({ assert }) => {
    const result = evaluateSchedule('ross', 20, 789)

    assert.deepEqual(result, { direction: 'slow', days: 2, offTable: false })
  })

  test('on schedule at exactly the standard weight', ({ assert }) => {
    const result = evaluateSchedule('ross', 20, 935)

    assert.deepEqual(result, { direction: 'on_schedule', days: 0, offTable: false })
  })

  test('fast by whole days: Ross day 20 at 1.092 kg is the weight of day 22', ({ assert }) => {
    const result = evaluateSchedule('ross', 20, 1092)

    assert.deepEqual(result, { direction: 'fast', days: 2, offTable: false })
  })

  test('slow with decimals: Cobb day 35 at 2.100 kg is 3.94 days slow', ({ assert }) => {
    const result = evaluateSchedule('cobb', 35, 2100)

    assert.deepEqual(result, { direction: 'slow', days: 3.94, offTable: false })
  })

  test('fast with decimals: AA Plus day 14 at 0.560 kg is 0.56 days fast', ({ assert }) => {
    const result = evaluateSchedule('aa_plus', 14, 560)

    assert.deepEqual(result, { direction: 'fast', days: 0.56, offTable: false })
  })

  test('slow between two table days: Ross day 20 at 0.800 kg is 1.85 days slow', ({ assert }) => {
    const result = evaluateSchedule('ross', 20, 800)

    assert.deepEqual(result, { direction: 'slow', days: 1.85, offTable: false })
  })

  test('rounds an exact half away from zero when slow (0.875 shows 0.88)', ({ assert }) => {
    const result = evaluateSchedule('ross', 7, 185)

    assert.deepEqual(result, { direction: 'slow', days: 0.88, offTable: false })
  })

  test('rounds an exact half away from zero when fast (4.125 shows 4.13)', ({ assert }) => {
    const result = evaluateSchedule('ross', 2, 185)

    assert.deepEqual(result, { direction: 'fast', days: 4.13, offTable: false })
  })

  test('above the table gives a minimum: Ross day 40 at 3.300 kg is at least 4 days fast', ({
    assert,
  }) => {
    const result = evaluateSchedule('ross', 40, 3300)

    assert.deepEqual(result, { direction: 'fast', days: 4, offTable: true })
  })

  test('above the table at day 44 has no days to give', ({ assert }) => {
    const result = evaluateSchedule('ross', 44, 3500)

    assert.deepEqual(result, { direction: 'fast', days: 0, offTable: true })
  })

  test('below the table gives a minimum: Ross day 10 at 0.030 kg is at least 10 days slow', ({
    assert,
  }) => {
    const result = evaluateSchedule('ross', 10, 30)

    assert.deepEqual(result, { direction: 'slow', days: 10, offTable: true })
  })

  test('a 1 g difference is still shown, not hidden (0.01 days fast)', ({ assert }) => {
    const result = evaluateSchedule('ross', 20, 936)

    assert.deepEqual(result, { direction: 'fast', days: 0.01, offTable: false })
  })

  test('has no standard for age 45', ({ assert }) => {
    assert.throws(() => evaluateSchedule('ross', 45, 2500), 'no standard weight for this age')
  })

  test('every Standard Table rises every day, which the days maths relies on', ({ assert }) => {
    for (const breed of BREEDS) {
      const table = STANDARD_WEIGHTS_GRAMS[breed]

      for (let day = 1; day < table.length; day++) {
        assert.isAbove(
          table[day],
          table[day - 1],
          `${breed} day ${day} is not above day ${day - 1}`
        )
      }
    }
  })
})
