import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Monster from '#models/monster'
import Member from '#models/member'
import { v4 as uuidv4 } from 'uuid'

export default class Box extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async assignUuid(box: Box) {
    box.id = uuidv4()
  }

  @column()
  declare monster_id: number

  @column()
  declare member_id: string

  @column()
  declare quantity: number

  @column()
  declare monsters_assigned: number

  @belongsTo(() => Monster)
  declare monster: BelongsTo<typeof Monster>

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>
}
