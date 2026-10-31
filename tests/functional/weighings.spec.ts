import { test } from '@japa/runner'
import User from '#models/user'
import Weighing from '#models/weighing'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

async function createUser() {
  return User.create({ email: 'sister@example.com', password: 'chick-pass-123' })
}

const validForm = { breed: 'ross', ageDays: 21, weightKg: '0.950', weighedOn: '2026-10-31' }

test.group('Weighings', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('saves a weighing and shows it with gap -6.1% Slightly behind', async ({
    client,
    assert,
  }) => {
    const user = await createUser()

    const saved = await client
      .post('/weighings')
      .loginAs(user)
      .withCsrfToken()
      .form({
        breed: 'ross',
        ageDays: 21,
        weightKg: '0.950',
        weighedOn: '2026-10-31',
        note: 'House 2',
      })
      .redirects(0)
    const list = await client.get('/weighings').loginAs(user).withInertia()

    saved.assertStatus(302)
    saved.assertHeader('location', '/weighings')
    assert.lengthOf(list.inertiaProps.weighings, 1)
    assert.containSubset(list.inertiaProps.weighings[0], {
      breed: 'ross',
      ageDays: 21,
      weightGrams: 950,
      totalGrams: 950,
      weighedOn: '2026-10-31',
      note: 'House 2',
      standardGrams: 1012,
      gapGrams: -62,
      gapPercent: -6.1,
      status: 'slightly_behind',
    })
  })

  test('shows how many days slow a saved weighing is (Ross day 20 at 0.789 kg)', async ({
    client,
    assert,
  }) => {
    const user = await createUser()
    await Weighing.create({
      breed: 'ross',
      ageDays: 20,
      weightGrams: 789,
      totalGrams: 789,
      weighedOn: DateTime.fromISO('2026-10-31'),
    })

    const list = await client.get('/weighings').loginAs(user).withInertia()

    assert.deepEqual(list.inertiaProps.weighings[0].schedule, {
      direction: 'slow',
      days: 2,
      offTable: false,
    })
  })

  test('shows an old single-chick weighing as a batch of 1', async ({ client, assert }) => {
    const user = await createUser()
    await Weighing.create({
      breed: 'ross',
      ageDays: 21,
      weightGrams: 950,
      totalGrams: 950,
      weighedOn: DateTime.fromISO('2026-10-31'),
    })

    const list = await client.get('/weighings').loginAs(user).withInertia()

    assert.containSubset(list.inertiaProps.weighings[0], {
      weightGrams: 950,
      chickCount: 1,
      totalGrams: 950,
    })
  })

  test('converts kilograms to whole grams when saving', async ({ client, assert }) => {
    const user = await createUser()

    for (const weightKg of ['0.950', '1.005']) {
      await client
        .post('/weighings')
        .loginAs(user)
        .withCsrfToken()
        .form({ breed: 'ross', ageDays: 21, weightKg, weighedOn: '2026-10-31' })
        .redirects(0)
    }

    const weighings = await Weighing.query().orderBy('id')
    const grams = weighings.map((weighing) => weighing.weightGrams)
    assert.deepEqual(grams, [950, 1005])
  })

  test('opens the add form with a date and the three breeds', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client.get('/weighings/create').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('weighings/create')
    assert.match(response.inertiaProps.today, /^\d{4}-\d{2}-\d{2}$/)
    assert.deepEqual(
      response.inertiaProps.breeds.map((breed: { label: string }) => breed.label),
      ['Ross', 'Cobb', 'AA Plus']
    )
  })

  test('sends the standard weights so the form can show them while typing', async ({
    client,
    assert,
  }) => {
    const user = await createUser()

    const response = await client.get('/weighings/create').loginAs(user).withInertia()

    const { standards } = response.inertiaProps
    assert.lengthOf(standards.ross, 45)
    assert.equal(standards.ross[21], 1012)
    assert.equal(standards.cobb[35], 2521)
    assert.equal(standards.aa_plus[14], 527)
  })

  test('opens the edit form with the saved values', async ({ client, assert }) => {
    const user = await createUser()
    const weighing = await Weighing.create({
      breed: 'cobb',
      ageDays: 35,
      weightGrams: 2100,
      totalGrams: 2100,
      weighedOn: DateTime.fromISO('2026-10-20'),
      note: 'House 2',
    })

    const response = await client.get(`/weighings/${weighing.id}/edit`).loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('weighings/edit')
    assert.containSubset(response.inertiaProps.weighing, {
      id: weighing.id,
      breed: 'cobb',
      ageDays: 35,
      weightGrams: 2100,
      totalGrams: 2100,
      weighedOn: '2026-10-20',
      note: 'House 2',
    })
  })

  test('updates a weighing and the status changes', async ({ client, assert }) => {
    const user = await createUser()
    const weighing = await Weighing.create({
      breed: 'ross',
      ageDays: 21,
      weightGrams: 1012,
      totalGrams: 1012,
      weighedOn: DateTime.fromISO('2026-10-20'),
    })

    const updated = await client
      .put(`/weighings/${weighing.id}`)
      .loginAs(user)
      .withCsrfToken()
      .form({ ...validForm, weightKg: '0.950', note: 'weighed again' })
      .redirects(0)
    const list = await client.get('/weighings').loginAs(user).withInertia()

    updated.assertStatus(302)
    updated.assertHeader('location', '/weighings')
    assert.lengthOf(list.inertiaProps.weighings, 1)
    assert.containSubset(list.inertiaProps.weighings[0], {
      id: weighing.id,
      weightGrams: 950,
      totalGrams: 950,
      note: 'weighed again',
      status: 'slightly_behind',
    })
  })

  test('deletes a weighing', async ({ client, assert }) => {
    const user = await createUser()
    const weighing = await Weighing.create({
      breed: 'ross',
      ageDays: 21,
      weightGrams: 1012,
      totalGrams: 1012,
      weighedOn: DateTime.fromISO('2026-10-20'),
    })

    const response = await client
      .delete(`/weighings/${weighing.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/weighings')
    assert.lengthOf(await Weighing.all(), 0)
  })

  test('shows 30 weighings per page, newest first', async ({ client, assert }) => {
    const user = await createUser()
    const base = { breed: 'ross', ageDays: 21, weightGrams: 1000, totalGrams: 1000 }
    for (let day = 1; day <= 31; day++) {
      await Weighing.create({
        ...base,
        weighedOn: DateTime.fromISO('2026-08-31').plus({ days: day }),
        note: `day ${day}`,
      })
    }

    const first = await client.get('/weighings').loginAs(user).withInertia()
    const second = await client.get('/weighings?page=2').loginAs(user).withInertia()

    assert.lengthOf(first.inertiaProps.weighings, 30)
    assert.equal(first.inertiaProps.weighings[0].note, 'day 31')
    assert.equal(first.inertiaProps.pagination.lastPage, 2)
    assert.deepEqual(
      second.inertiaProps.weighings.map((weighing: { note: string }) => weighing.note),
      ['day 1']
    )
    assert.equal(second.inertiaProps.pagination.currentPage, 2)
  })

  test('cannot add, edit, delete or open the forms when not logged in', async ({
    client,
    assert,
  }) => {
    const weighing = await Weighing.create({
      breed: 'ross',
      ageDays: 21,
      weightGrams: 1012,
      totalGrams: 1012,
      weighedOn: DateTime.fromISO('2026-10-20'),
    })

    const responses = [
      await client.get('/weighings/create').redirects(0),
      await client.get(`/weighings/${weighing.id}/edit`).redirects(0),
      await client.post('/weighings').withCsrfToken().form(validForm).redirects(0),
      await client
        .put(`/weighings/${weighing.id}`)
        .withCsrfToken()
        .form({ ...validForm, weightKg: '0.500' })
        .redirects(0),
      await client.delete(`/weighings/${weighing.id}`).withCsrfToken().redirects(0),
    ]

    for (const response of responses) {
      response.assertStatus(302)
      response.assertHeader('location', '/login')
    }
    const saved = await Weighing.query().orderBy('id')
    assert.deepEqual(
      saved.map((row) => [row.id, row.weightGrams]),
      [[weighing.id, 1012]]
    )
  })

  test('shows not found for a weighing that does not exist', async ({ client }) => {
    const user = await createUser()

    const edit = await client.get('/weighings/999999/edit').loginAs(user).withInertia()
    const update = await client
      .put('/weighings/999999')
      .loginAs(user)
      .withCsrfToken()
      .form(validForm)
      .redirects(0)
    const destroy = await client
      .delete('/weighings/999999')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)

    edit.assertStatus(404)
    update.assertStatus(404)
    destroy.assertStatus(404)
  })

  test('shows not found when the id in the address is not a number', async ({ client }) => {
    const user = await createUser()

    const edit = await client.get('/weighings/abc/edit').loginAs(user).withInertia()
    const update = await client
      .put('/weighings/abc')
      .loginAs(user)
      .withCsrfToken()
      .form(validForm)
      .redirects(0)
    const destroy = await client.delete('/weighings/abc').loginAs(user).withCsrfToken().redirects(0)

    edit.assertStatus(404)
    update.assertStatus(404)
    destroy.assertStatus(404)
  })

  test('rejects age 45 with "No standard weight for this age"', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client
      .post('/weighings')
      .header('referer', '/weighings/create')
      .loginAs(user)
      .withCsrfToken()
      .form({ ...validForm, ageDays: 45 })
      .redirects(0)

    response.assertHeader('location', '/weighings/create')
    response.assertFlashMessage('inputErrorsBag', {
      ageDays: ['No standard weight for this age'],
    })
    assert.lengthOf(await Weighing.all(), 0)
  })

  test('asks for empty fields in plain words', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client
      .post('/weighings')
      .header('referer', '/weighings/create')
      .loginAs(user)
      .withCsrfToken()
      .form({ ...validForm, ageDays: '', weightKg: '', weighedOn: '' })
      .redirects(0)

    response.assertFlashMessage('inputErrorsBag', {
      ageDays: ['Please enter the age'],
      weightKg: ['Please enter the weight'],
      weighedOn: ['Please enter the date'],
    })
    assert.lengthOf(await Weighing.all(), 0)
  })

  test('rejects weight 0 with "Weight must be more than 0"', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client
      .post('/weighings')
      .header('referer', '/weighings/create')
      .loginAs(user)
      .withCsrfToken()
      .form({ ...validForm, weightKg: '0' })
      .redirects(0)

    response.assertHeader('location', '/weighings/create')
    response.assertFlashMessage('inputErrorsBag', {
      weightKg: ['Weight must be more than 0'],
    })
    assert.lengthOf(await Weighing.all(), 0)
  })

  test('lists newest weighing first', async ({ client, assert }) => {
    const user = await createUser()
    const base = { breed: 'ross', ageDays: 21, weightGrams: 1000, totalGrams: 1000 }
    await Weighing.create({ ...base, weighedOn: DateTime.fromISO('2026-10-01'), note: 'oldest' })
    await Weighing.create({ ...base, weighedOn: DateTime.fromISO('2026-10-20'), note: 'newer' })
    await Weighing.create({ ...base, weighedOn: DateTime.fromISO('2026-10-20'), note: 'newest' })

    const response = await client.get('/weighings').loginAs(user).withInertia()

    const notes = response.inertiaProps.weighings.map((weighing: { note: string }) => weighing.note)
    assert.deepEqual(notes, ['newest', 'newer', 'oldest'])
  })

  test('filters history by breed', async ({ client, assert }) => {
    const user = await createUser()
    const base = {
      ageDays: 21,
      weightGrams: 1000,
      totalGrams: 1000,
      weighedOn: DateTime.fromISO('2026-10-20'),
    }
    await Weighing.create({ ...base, breed: 'ross' })
    await Weighing.create({ ...base, breed: 'cobb' })

    const response = await client.get('/weighings?breed=cobb').loginAs(user).withInertia()

    const breeds = response.inertiaProps.weighings.map(
      (weighing: { breed: string }) => weighing.breed
    )
    assert.deepEqual(breeds, ['cobb'])
  })

  test('rejects a breed that is not Ross, Cobb or AA Plus', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client
      .post('/weighings')
      .header('referer', '/weighings/create')
      .loginAs(user)
      .withCsrfToken()
      .form({ ...validForm, breed: 'duck' })
      .redirects(0)

    response.assertHeader('location', '/weighings/create')
    response.assertFlashMessage('inputErrorsBag', {
      breed: ['Choose Ross, Cobb or AA Plus'],
    })
    assert.lengthOf(await Weighing.all(), 0)
  })
})
