import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'defenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('leader_monster').unsigned().references('monsters.unit_master_id').notNullable()
      table.integer('second_monster').unsigned().references('monsters.unit_master_id').notNullable()
      table.integer('third_monster').unsigned().references('monsters.unit_master_id').notNullable()
      table.integer('member_id').unsigned().references('members.id').notNullable()
      table
        .integer('composition_id')
        .unsigned()
        .references('compositions.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('tower_id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
