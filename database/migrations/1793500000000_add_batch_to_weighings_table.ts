import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weighings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('chick_count').notNullable().defaultTo(1)
      table.integer('total_grams').nullable()
    })

    // Every weighing made before batches was one chick, so its total is its own weight
    this.schema.raw('UPDATE weighings SET total_grams = weight_grams')

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('total_grams').notNullable().alter()
      table.check('chick_count >= 1 AND chick_count <= 1000', [], 'weighings_chick_count_range')
      table.check('total_grams > 0', [], 'weighings_total_grams_positive')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropChecks(['weighings_chick_count_range', 'weighings_total_grams_positive'])
      table.dropColumn('total_grams')
      table.dropColumn('chick_count')
    })
  }
}
