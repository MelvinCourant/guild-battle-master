import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monsters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.enum('attribute', ['fire', 'water', 'wind', 'light', 'dark']).notNullable()
      table.enum('natural_grade', [2, 3, 4, 5]).notNullable()
      table.string('image').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
