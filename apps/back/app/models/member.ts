import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Guild from '#models/guild'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare wizard_id: number

  @column()
  declare pseudo: string

  @column()
  declare grade: 'leader' | 'vice-leader' | 'senior' | 'member'

  @column()
  declare user_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare guild_id: number

  @belongsTo(() => Guild)
  declare guild: BelongsTo<typeof Guild>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
