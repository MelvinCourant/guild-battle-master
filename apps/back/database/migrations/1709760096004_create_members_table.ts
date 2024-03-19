import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('pseudo').notNullable()
      table.unique(['pseudo'])
      table.enu('grade', ['leader', 'vice-leader', 'senior', 'member']).notNullable().defaultTo('member')
      table.integer('user_id').unsigned().references('user.id').nullable()
      table.integer('guild_id').unsigned().references('id').inTable('guilds').notNullable()
      table.unique(['id', 'guild_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}