import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weighings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('breed', 20).notNullable()
      table.integer('age_days').notNullable()
      table.integer('weight_grams').notNullable()
      table.date('weighed_on').notNullable()
      table.string('note', 100).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['weighed_on', 'id'])
      table.check('age_days >= 0')
      table.check('weight_grams > 0')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
