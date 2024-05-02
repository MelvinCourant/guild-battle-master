import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'

export default class Guild extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async assignUuid(guild: Guild) {
    guild.id = uuidv4()
  }

  @column()
  declare guild_id_json: number

  @column()
  declare name: string

  @column()
  declare birth_date: Date

  @column()
  declare leader_id: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare image: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
