import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'defenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('leader_monster').unsigned().references('monsters.unit_master_id').notNullable()
      table.integer('second_monster').unsigned().references('monsters.unit_master_id').notNullable()
      table.integer('third_monster').unsigned().references('monsters.unit_master_id').notNullable()
      table.string('member_id').references('id').inTable('members').notNullable()
      table
        .string('composition_id')
        .references('id')
        .inTable('compositions')
        .notNullable()
        .onDelete('CASCADE')
      table.string('tower_id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
