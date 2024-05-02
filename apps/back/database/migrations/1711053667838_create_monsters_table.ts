import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monsters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('unit_master_id').unsigned().notNullable().unique()
      table.string('name').notNullable()
      table.enum('element', ['fire', 'water', 'wind', 'light', 'dark']).notNullable()
      table.enum('natural_grade', [2, 3, 4, 5]).notNullable()
      table.string('image').notNullable()
      table.boolean('is_fully_awakened').notNullable().defaultTo(false)
      table.boolean('is_fusion_shop').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
