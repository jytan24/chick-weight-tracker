import User from '#models/user'
import { createUserValidator } from '#validators/user'
import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { errors } from '@vinejs/vine'

export default class CreateUser extends BaseCommand {
  static commandName = 'create:user'
  static description = 'Create the farm login, or reset its password if the email already exists'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Email address used to log in' })
  declare email: string

  async run() {
    const password = await this.prompt.secure('Password (8 to 32 characters)')
    const repeated = await this.prompt.secure('Type the password again')

    if (password !== repeated) {
      this.logger.error('The two passwords are not the same')
      this.exitCode = 1
      return
    }

    try {
      const data = await createUserValidator.validate({ email: this.email, password })
      const existing = await User.findBy('email', data.email)

      await User.updateOrCreate({ email: data.email }, { password: data.password })
      this.logger.success(
        existing ? `Password updated for ${data.email}` : `Account created for ${data.email}`
      )
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        error.messages.forEach((message: { message: string }) => this.logger.error(message.message))
        this.exitCode = 1
        return
      }

      throw error
    }
  }
}
