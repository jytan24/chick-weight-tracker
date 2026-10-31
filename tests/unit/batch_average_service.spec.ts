import { test } from '@japa/runner'
import { averageWeightGrams } from '#services/batch_average_service'

test.group('Batch average service', () => {
  test('average of 10 chicks', ({ assert }) => {
    assert.equal(averageWeightGrams(7890, 10), 789)
  })

  test('average of 104 chicks rounds to the nearest gram (949.04 gives 949)', ({ assert }) => {
    assert.equal(averageWeightGrams(98700, 104), 949)
  })

  test('an exact half rounds up (949.5 gives 950)', ({ assert }) => {
    assert.equal(averageWeightGrams(9495, 10), 950)
  })

  test('one chick is its own average', ({ assert }) => {
    assert.equal(averageWeightGrams(950, 1), 950)
  })

  test('has no average for 0 chicks', ({ assert }) => {
    assert.throws(() => averageWeightGrams(950, 0), 'a batch needs at least 1 chick')
  })
})
