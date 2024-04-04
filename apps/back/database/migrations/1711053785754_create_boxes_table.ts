import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'boxes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('monster_id').unsigned().references('monsters.unit_master_id')
      table.integer('member_id').unsigned().references('members.id')
      table.integer('quantity').notNullable().defaultTo(1)
      table.integer('monsters_assigned').notNullable().defaultTo(0)
      table.unique(['id', 'member_id', 'monster_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
