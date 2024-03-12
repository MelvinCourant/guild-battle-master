import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.enu('role', ['admin', 'leader', 'member']).notNullable().defaultTo('member')
      table.string('image').nullable()
      table.string('remember_me_token').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}