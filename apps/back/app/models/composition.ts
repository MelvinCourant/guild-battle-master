import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import Guild from "#models/guild";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class Composition extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare grade: 4 | 5

  @column()
  declare guild_id: number

  @belongsTo(() => Guild)
  declare user: BelongsTo<typeof Guild>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
