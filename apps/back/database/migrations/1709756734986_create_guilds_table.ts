import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guilds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('guild_id_json').notNullable()
      table.string('name').notNullable()
      table.string('leader_id').references('id').inTable('users')
      table.unique(['name', 'leader_id'])
      table.string('image').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
