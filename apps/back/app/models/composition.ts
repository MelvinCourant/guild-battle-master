import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Guild from '#models/guild'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class Composition extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async assignUuid(composition: Composition) {
    composition.id = uuidv4()
  }

  @column()
  declare name: string

  @column()
  declare grade: 4 | 5

  @column()
  declare guild_id: string

  @belongsTo(() => Guild)
  declare user: BelongsTo<typeof Guild>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
