import type { HttpContext } from '@adonisjs/core/http'
import Monster from '#models/monster'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

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
        const notKorean = new RegExp(/^[a-z A-Z]+$/)
        const monstersNotReleased = [
          'unit_icon_0019_0_3.png',
          'unit_icon_0019_0_4.png',
          'unit_icon_0019_1_3.png',
          'unit_icon_0019_1_4.png',
          'unit_icon_0019_2_3.png',
          'unit_icon_0019_2_4.png',
          'unit_icon_0019_3_3.png',
          'unit_icon_0019_3_4.png',
          'unit_icon_0019_4_3.png',
          'unit_icon_0019_4_4.png',
        ]

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
      const collabMonsters = [
        'RYU',
        'CHUN-LI',
        'DHALSIM',
        'M. BISON',
        'Madeleine Cookie',
        'Espresso Cookie',
        'Hollyberry Cookie',
        'Pure Vanilla Cookie',
        'Eivor',
        'Kassandra',
        'Ezio',
        'Bayek',
        'Geralt',
        'Ciri',
        'Yennefer',
        'Triss',
      ]

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

        const fusionOrShopMonsters = [
          'water-ifrit',
          'fire-ifrit',
          'wind-ifrit',
          'dark-ifrit',
          'light-ifrit',
          'water-phoenix',
          'fire-panda-warrior',
          'light-paladin',
          'dark-dokkaebi-lord',
          'light-fairy-queen',
          'dark-vampire-lord',
          'homunculus',
          'fire-ken',
          'light-dual-blade',
          'fire-shadow-claw',
          'light-altaïr',
          'light-magical-archer-fami',
          'wind-lollipop-warrior',
          'wind-gingerbrave',
          'cow-girl',
          'wind-totemist',
          'wind-valkyrja',
        ]

        if (
          (monster.awakens_from && !monster.awakens_to) ||
          collabMonsters.includes(monster.name)
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

  async show({ params, response }: HttpContext) {
    const { id } = params
    const monster = await Monster.find(id)

    if (!monster) {
      return response.status(404).json({ message: 'Monster not found' })
    }

    return response.status(200).json(monster)
  }

  async index({ request, response }: HttpContext) {
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
