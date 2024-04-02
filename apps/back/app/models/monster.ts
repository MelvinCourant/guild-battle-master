import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Monster extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare monster_id: number

  @column()
  declare name: string

  @column()
  declare element: 'fire' | 'water' | 'wind' | 'light' | 'dark'

  @column()
  declare natural_grade: 2 | 3 | 4 | 5

  @column()
  declare image: string
}
