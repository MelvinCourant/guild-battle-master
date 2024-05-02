import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async assignUuid(notification: Notification) {
    notification.id = uuidv4()
  }

  @column()
  sender_id: string

  @column()
  receiver_id: string

  @belongsTo(() => User)
  declare monster: BelongsTo<typeof User>

  @column()
  message: string

  @column()
  action: string

  @column()
  is_read: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
