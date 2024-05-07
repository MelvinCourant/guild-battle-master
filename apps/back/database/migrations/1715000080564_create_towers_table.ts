import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'towers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('guild_id').notNullable().references('id').inTable('guilds').onDelete('CASCADE')
      table.integer('position').notNullable()
      table.enu('grade', [4, 5]).defaultTo(5)
      table.enu('side', ['blue', 'red', 'yellow']).defaultTo('blue')
      table.enu('map', ['classic', 'tournament']).defaultTo('classic')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
