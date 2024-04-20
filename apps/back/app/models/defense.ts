import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import Monster from "#models/monster";
import Member from "#models/member";
import Composition from "#models/composition";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export default class Defense extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare leader_monster: number

  @column()
  declare second_monster: number

  @column()
  declare third_monster: number

  @belongsTo(() => Monster)
  declare monster: BelongsTo<typeof Monster>

  @column()
  declare member_id: number

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>

  @column()
  declare composition_id: number

  @belongsTo(() => Composition)
  declare composition: BelongsTo<typeof Composition>

  @column()
  declare tower_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
