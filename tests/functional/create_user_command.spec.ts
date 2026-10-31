import { test } from '@japa/runner'
import ace from '@adonisjs/core/services/ace'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import CreateUser from '../../commands/create_user.js'

const PASSWORD_PROMPT = 'Password (8 to 32 characters)'
const REPEAT_PROMPT = 'Type the password again'

test.group('create:user command', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  group.each.setup(() => {
    ace.ui.switchMode('raw')
    return () => ace.ui.switchMode('normal')
  })

  test('creates an account that can log in', async ({ assert }) => {
    const command = await ace.create(CreateUser, ['sister@example.com'])
    command.prompt.trap(PASSWORD_PROMPT).replyWith('chick-pass-123')
    command.prompt.trap(REPEAT_PROMPT).replyWith('chick-pass-123')

    await command.exec()

    command.assertSucceeded()
    const user = await User.verifyCredentials('sister@example.com', 'chick-pass-123')
    assert.equal(user.email, 'sister@example.com')
  })

  test('resets the password when the email already exists', async ({ assert }) => {
    await User.create({ email: 'sister@example.com', password: 'old-password-123' })
    const command = await ace.create(CreateUser, ['sister@example.com'])
    command.prompt.trap(PASSWORD_PROMPT).replyWith('new-password-456')
    command.prompt.trap(REPEAT_PROMPT).replyWith('new-password-456')

    await command.exec()

    command.assertSucceeded()
    await User.verifyCredentials('sister@example.com', 'new-password-456')
    await assert.rejects(() => User.verifyCredentials('sister@example.com', 'old-password-123'))
  })

  test('refuses when the two passwords are not the same', async ({ assert }) => {
    const command = await ace.create(CreateUser, ['sister@example.com'])
    command.prompt.trap(PASSWORD_PROMPT).replyWith('chick-pass-123')
    command.prompt.trap(REPEAT_PROMPT).replyWith('chick-pass-999')

    await command.exec()

    command.assertFailed()
    assert.isNull(await User.findBy('email', 'sister@example.com'))
  })
})
