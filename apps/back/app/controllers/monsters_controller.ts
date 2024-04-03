import type { HttpContext } from '@adonisjs/core/http'
import Monster from "#models/monster";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

export default class MonstersController {
  public async create({ response }: HttpContext) {
    const streamPipeline = promisify(pipeline);
    let totalPages: number = 1

    async function getSwarfarmMonsters(page: number) {
      const result = await fetch(`https://swarfarm.com/api/v2/monsters/?base_stars__gte=3&page=${page}`)
      return result.json()
    }

    let pageResults: any = await getSwarfarmMonsters(totalPages)

    if(totalPages === 1) {
      totalPages = (pageResults.count / 100) + 1
    }

    for (let i = 1; i <= totalPages; i++) {
      pageResults = await getSwarfarmMonsters(i)
      const monsters = pageResults.results

      for (const monster of monsters) {
        const notKorean = new RegExp(/^[a-zA-Z]+$/)

        if (notKorean.test(monster.name)) {
          await insertMonsterIntoDb(monster)
        }
      }
    }

    async function insertMonsterIntoDb(monster: any) {
      const result: any = await fetch(`https://swarfarm.com/static/herders/images/monsters/${monster.image_filename}`)
      const dirPath = 'uploads/monsters'

      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const bestiarySlug = monster.bestiary_slug.replace(/\d+-/g, '');
      const monsterFileName = `${bestiarySlug}.png`
      const monsterExists = fs.existsSync(`${dirPath}/${monsterFileName}`)

      if (monsterExists) {
        return
      }

      await streamPipeline(result.body, fs.createWriteStream(`${dirPath}/${monsterFileName}`))

      let monsterName: string = monster.name
      const monsterElement: string = monster.element.toLowerCase()

      if(monster.awakens_to) {
        monsterName = `${monster.element} ${monsterName}`
      }

      const monsterData = {
        unit_master_id: monster.com2us_id,
        name: monsterName,
        element: monsterElement,
        natural_grade: monster.natural_stars - 1, // -1 to fix natural_grade is 1 star higher than it should be
        image: `/monsters/${monsterFileName}`,
      }
      // @ts-ignore
      await Monster.create(monsterData)

      console.log(`Monster ${monsterName} created successfully`)
    }

    return response.status(200).json({ message: 'Monsters created successfully' })
  }
}
