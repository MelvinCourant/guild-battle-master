import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('wizard_id').unsigned().notNullable()
      table.string('pseudo').notNullable()
      table
        .enu('grade', ['leader', 'vice-leader', 'senior', 'member'])
        .notNullable()
        .defaultTo('member')
      table.string('user_id').references('id').inTable('users').nullable().onDelete('CASCADE')
      table.string('guild_id').references('id').inTable('guilds').nullable()
      table.unique(['id', 'guild_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
