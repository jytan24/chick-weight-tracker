import { test } from '@japa/runner'
import User from '#models/user'
import limiter from '@adonisjs/limiter/services/main'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  group.each.setup(() => limiter.clear(['memory']))

  test('redirects to login when not logged in and opening history', async ({ client }) => {
    const response = await client.get('/weighings')

    response.assertRedirectsTo('/login')
  })

  test('logs in with correct email and password and lands on history', async ({ client }) => {
    await User.create({ email: 'sister@example.com', password: 'chick-pass-123' })

    const response = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: 'sister@example.com', password: 'chick-pass-123' })
      .redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/weighings')
  })

  test('logs in when the email is typed with different capital letters', async ({ client }) => {
    await User.create({ email: 'sister@example.com', password: 'chick-pass-123' })

    const response = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: ' Sister@Example.com ', password: 'chick-pass-123' })
      .redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/weighings')
  })

  test('shows an error with a wrong password', async ({ client, assert }) => {
    await User.create({ email: 'sister@example.com', password: 'chick-pass-123' })

    const response = await client
      .post('/login')
      .header('referer', '/login')
      .withCsrfToken()
      .form({ email: 'sister@example.com', password: 'not-the-password' })
      .redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/login')
    response.assertFlashMessage('error', 'Invalid user credentials')
    assert.notProperty(response.session(), 'auth_web')
  })

  test('blocks login after too many attempts, even with the right password', async ({
    client,
    assert,
  }) => {
    await User.create({ email: 'sister@example.com', password: 'chick-pass-123' })

    for (let attempt = 0; attempt < 10; attempt++) {
      await client
        .post('/login')
        .withCsrfToken()
        .form({ email: 'sister@example.com', password: 'not-the-password' })
        .redirects(0)
    }
    const response = await client
      .post('/login')
      .withCsrfToken()
      .form({ email: 'sister@example.com', password: 'chick-pass-123' })
      .redirects(0)

    response.assertStatus(429)
    assert.notProperty(response.session(), 'auth_web')
  })

  test('has no public sign-up page', async ({ client }) => {
    const page = await client.get('/signup')
    const submit = await client
      .post('/signup')
      .withCsrfToken()
      .form({ email: 'stranger@example.com', password: 'stranger-pass-123' })

    page.assertStatus(404)
    submit.assertStatus(404)
  })

  test('opens history when logged in', async ({ client }) => {
    const user = await User.create({ email: 'sister@example.com', password: 'chick-pass-123' })

    const response = await client.get('/weighings').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('weighings/index')
  })

  test('logs out and no longer counts as logged in', async ({ client, assert }) => {
    const user = await User.create({ email: 'sister@example.com', password: 'chick-pass-123' })

    const response = await client.post('/logout').loginAs(user).withCsrfToken().redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/login')
    assert.notProperty(response.session(), 'auth_web')
  })
})
