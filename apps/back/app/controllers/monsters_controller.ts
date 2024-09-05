import type { HttpContext } from '@adonisjs/core/http'
import Monster from '#models/monster'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import monstersConfig from '../../monsters_config.json' assert { type: 'json' }

export default class MonstersController {
  async create({ response }: HttpContext) {
    const streamPipeline = promisify(pipeline)
    let totalPages: number = 1

    async function getSwarfarmMonsters(page: number) {
      const result = await fetch(
        `https://swarfarm.com/api/v2/monsters/?base_stars__gte=3&page=${page}`
      )
      return result.json()
    }

    let pageResults: any = await getSwarfarmMonsters(totalPages)

    if (totalPages === 1) {
      totalPages = pageResults.count / 100 + 1
    }

    for (let i = 1; i <= totalPages; i++) {
      pageResults = await getSwarfarmMonsters(i)
      const monsters = pageResults.results

      for (const monster of monsters) {
        const monsterExists = await Monster.findBy('unit_master_id', monster.com2us_id)

        if (monsterExists) {
          continue
        }

        const notKorean = new RegExp(/^[a-zA-Z0-9-. éï]+$/)
        const monstersNotReleased = monstersConfig.not_released

        if (
          notKorean.test(monster.name) &&
          !monstersNotReleased.includes(monster.image_filename) &&
          (monster.transforms_to > monster.id || !monster.transforms_to)
        ) {
          await insertMonsterIntoDb(monster)
        }
      }
    }

    async function insertMonsterIntoDb(monster: any) {
      let monsterName: string = monster.name
      const monsterElement: string = monster.element.toLowerCase()
      const collabMonsters = monstersConfig.collab
      const freeCollabMonsters = monstersConfig.free_collab

      if (monster.awakens_to || collabMonsters.includes(monsterName)) {
        monsterName = `${monster.element} ${monsterName}`
      }

      const monsterFileName = monster.image_filename
      const result: any = await fetch(
        `https://swarfarm.com/static/herders/images/monsters/${monsterFileName}`
      )
      const dirPath = 'uploads/monsters'

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      const imageExists = fs.existsSync(`${dirPath}/${monsterFileName}`)

      if (!imageExists) {
        await streamPipeline(result.body, fs.createWriteStream(`${dirPath}/${monsterFileName}`))
      }

      const monsterExists = await Monster.findBy('unit_master_id', monster.com2us_id)

      if (!monsterExists) {
        let isFullyAwakened = false
        let isFusionOrShop = false

        const fusionOrShopMonsters = monstersConfig.fusion_shop

        if (
          (monster.awakens_from && !monster.awakens_to) ||
          collabMonsters.includes(monster.name) ||
          freeCollabMonsters.includes(monster.name)
        ) {
          isFullyAwakened = true
        }

        if (fusionOrShopMonsters.some((slug) => monster.bestiary_slug.includes(slug))) {
          isFusionOrShop = true
        }

        const monsterData = {
          unit_master_id: monster.com2us_id,
          name: monsterName,
          element: monsterElement,
          natural_grade: monster.natural_stars - 1, // -1 to fix natural_grade is 1 star higher than it should be
          image: `monsters/${monsterFileName}`,
          is_fully_awakened: isFullyAwakened,
          is_fusion_shop: isFusionOrShop,
        }
        // @ts-ignore
        await Monster.create(monsterData)
      }

      if (!imageExists || !monsterExists) {
        console.log(`Monster ${monsterName} created successfully`)
      }
    }

    return response.status(200).json({ message: 'Monsters created successfully' })
  }

  async show({ i18n, params, response }: HttpContext) {
    const { id } = params
    const monster = await Monster.query().where('unit_master_id', id).first()

    if (!monster) {
      return response.status(404).json({ message: i18n.t('messages.monster_not_found') })
    }

    return response.status(200).json(monster)
  }

  async list({ request, response }: HttpContext) {
    let monsters
    const grade = request.input('grade')

    if (grade === 'all') {
      monsters = await Monster.query().where('is_fully_awakened', true).orderBy('name', 'asc')
    } else if (grade === 4) {
      monsters = await Monster.query()
        .where('is_fully_awakened', true)
        .whereRaw('natural_grade < ?', [grade])
        .orderBy('name', 'asc')
    }

    return response.status(200).json(monsters)
  }
}
