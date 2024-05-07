import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'

export default class Tower extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async assignUuid(tower: Tower) {
    tower.id = uuidv4()
  }

  @column()
  declare guild_id: string

  @column()
  declare position: number

  @column()
  declare grade: 4 | 5

  @column()
  declare side: 'blue' | 'red' | 'yellow'

  @column()
  declare map: 'classic' | 'tournament'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
