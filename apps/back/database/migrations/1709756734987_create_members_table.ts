import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('wizard_id').unsigned().notNullable()
      table.string('pseudo').notNullable()
      table
        .enu('grade', ['leader', 'vice-leader', 'senior', 'member'])
        .notNullable()
        .defaultTo('member')
      table.integer('user_id').unsigned().references('users.id').nullable().onDelete('CASCADE')
      table.integer('guild_id').unsigned().references('guilds.id').nullable()
      table.unique(['id', 'guild_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
