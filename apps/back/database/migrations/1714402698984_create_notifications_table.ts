import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sender_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table
        .integer('receiver_id')
        .unsigned()
        .references('users.id')
        .notNullable()
        .onDelete('CASCADE')
      table.string('message').notNullable()
      table.string('action')
      table.boolean('is_read').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
