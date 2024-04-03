import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Monster from "#models/monster";
import Member from "#models/member";

export default class Box extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare monster_id: number

  @column()
  declare member_id: number

  @column()
  declare quantity: number

  @column()
  declare monsters_assigned: number

  @belongsTo(() => Monster)
  declare monster: BelongsTo<typeof Monster>

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>
}
