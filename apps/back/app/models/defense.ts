import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Monster from '#models/monster'
import Member from '#models/member'
import Composition from '#models/composition'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class Defense extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async assignUuid(defense: Defense) {
    defense.id = uuidv4()
  }

  @column()
  declare leader_monster: number

  @column()
  declare second_monster: number

  @column()
  declare third_monster: number

  @belongsTo(() => Monster)
  declare monster: BelongsTo<typeof Monster>

  @column()
  declare member_id: string

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>

  @column()
  declare composition_id: string

  @belongsTo(() => Composition)
  declare composition: BelongsTo<typeof Composition>

  @column()
  declare tower_id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
