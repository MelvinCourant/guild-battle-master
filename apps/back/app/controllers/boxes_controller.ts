import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs'
import Box from '#models/box'
import Member from '#models/member'
import User from '#models/user'
import Monster from '#models/monster'
import { fileValidator } from '#validators/file'

export default class BoxesController {
  async create({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(fileValidator)
    const userRole = await User.query().where('id', user.id).select('role').firstOrFail()
    const memberId = params.memberId
    const member = await Member.query().where('id', memberId).firstOrFail()

    if (
      user.id !== member.user_id ||
      (userRole.role !== 'leader' && userRole.role !== 'moderator')
    ) {
      return response.status(403).json({ error: 'Membre invalide' })
    }

    const json = payload.json

    await json.move(app.makePath('uploads/json'), {
      name: `${cuid()}.${json.extname}`,
    })

    const jsonLink: string = `./uploads/json/${json.fileName}`
    const data = fs.readFileSync(jsonLink, 'utf8')

    if (!data) {
      fs.unlinkSync(jsonLink)
      return response.status(500).send({ message: 'Error reading json file' })
    }

    const jsonParsed: any = JSON.parse(data)
    const monsters: any = jsonParsed.unit_list

    async function createBoxes(monsters: any) {
      for (const monster of monsters) {
        const box: any = await Box.query()
          .where('monster_id', monster.unit_master_id)
          .andWhere('member_id', memberId)
          .first()
        const monsterExists: any = await Monster.query()
          .where('unit_master_id', monster.unit_master_id)
          .first()

        if (!monsterExists) {
          continue
        }

        if (box) {
          box.quantity = monsters.filter(
            (m: any) => m.unit_master_id === monster.unit_master_id
          ).length
          await box.save()
        } else {
          await Box.create({
            monster_id: monster.unit_master_id,
            member_id: memberId,
            quantity: 1,
            monsters_assigned: 0,
          })
        }
      }
    }

    await createBoxes(monsters)
    fs.unlinkSync(jsonLink)

    const memberBoxes = await Box.query().where('member_id', memberId)

    return response.status(201).json(memberBoxes)
  }

  async search({ auth, params, request, response }: HttpContext) {
    await auth.authenticate()
    const memberId = params.memberId
    const keyword = request.input('keyword')
    const filters = request.input('filters')
    const sort = request.input('sort')
    const boxes = await Box.query().where('member_id', memberId).select('monster_id', 'quantity')
    let monsters = []

    let query = Monster.query()
      .whereIn(
        'unit_master_id',
        boxes.map((box: any) => box.monster_id)
      )

    if (keyword) {
      query = query.andWhere('name', 'LIKE', `%${keyword}%`)
    }

    if (filters) {
      let elements = ['fire', 'water', 'wind', 'light', 'dark']
      let naturalGrades = [2, 3, 4, 5]

      for (const filter in filters) {
        if(
          filter === 'fire' ||
          filter === 'water' ||
          filter === 'wind' ||
          filter === 'light' ||
          filter === 'dark'
        ) {
          elements = elements.filter((e) => e !== filter)
        } else if(
          filter === '2_stars' ||
          filter === '3_stars' ||
          filter === '4_stars' ||
          filter === '5_stars'
        ) {
          const stars = parseInt(filter.split('_')[0])
          naturalGrades = naturalGrades.filter((n) => n !== stars)
        } else if(filters.hasOwnProperty(filter)) {
          query = query.andWhere(filter, filters[filter])
        }
      }

      if (
        elements.length < 5 &&
        elements.length > 0
      ) {
        query = query.andWhere((builder) => {
          elements.forEach((element, index) => {
            if (index === 0) {
              builder.where('element', element);
            } else {
              builder.orWhere('element', element);
            }
          });
        });
      }

      if (
        naturalGrades.length < 4 &&
        naturalGrades.length > 0
      ) {
        query = query.andWhere((builder) => {
          naturalGrades.forEach((grade, index) => {
            if (index === 0) {
              builder.where('natural_grade', grade - 1);
            } else {
              builder.orWhere('natural_grade', grade - 1);
            }
          });
        });
      }
    }

    monsters = await query

    let monstersWithQuantity: any[] = []

    for (const monster of monsters) {
      const box = boxes.find((b) => b.monster_id === monster.unit_master_id)
      const quantity = box ? box.quantity : 0

      if(quantity !== 0) {
        monstersWithQuantity.push({
          name: monster.name,
          element: monster.element,
          natural_grade: monster.natural_grade,
          image: monster.image,
          is_fusion_shop: monster.is_fusion_shop,
          quantity: quantity,
        })
      }
    }

    if(sort !== 'element') {
      if(sort === 'quantity') {
        monstersWithQuantity = monstersWithQuantity.sort((a, b) => b.quantity - a.quantity)
      } else if (sort === 'grade') {
        monstersWithQuantity = monstersWithQuantity.sort((a, b) => b.natural_grade - a.natural_grade)
      } else if(sort === 'name') {
        monstersWithQuantity = monstersWithQuantity.sort((a, b) => a.name.localeCompare(b.name))
      }
    } else {
      const elementsOrder = ['fire', 'water', 'wind', 'light', 'dark']
      monstersWithQuantity = monstersWithQuantity.sort((a, b) => {
        if (a.element === b.element) {
          return b.natural_grade - a.natural_grade
        }
        return elementsOrder.indexOf(a.element) - elementsOrder.indexOf(b.element)
      })
    }

    return response.status(200).json(monstersWithQuantity)
  }

  async compositions({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator'
    ) {
      return response.forbidden()
    }

    const guildId = params.guildId
    const members = await Member.query().where('guild_id', guildId).select('id', 'pseudo')
    const leaderMonsters = request.input('leader_monsters')
    const secondMonsters = request.input('second_monsters')
    const thirdMonsters = request.input('third_monsters')

    let compositions = []

    for (const member of members) {
      const boxes = await Box.query().where('member_id', member.id).whereRaw('monsters_assigned < quantity')
      const monsters = await Monster.query().whereIn(
        'unit_master_id',
        boxes.map((box) => box.monster_id)
      ).select('unit_master_id', 'image', 'element', 'natural_grade', 'name')

      function findPossibilities(requestMonsters: any) {
        let possibilities: any[] = []

        if(requestMonsters.includes('light')) {
          // @ts-ignore
          possibilities = possibilities.concat(monsters.filter((monster) => monster.element === 'light' && monster.natural_grade === '5'))
        } else if(requestMonsters.includes('dark')) {
          // @ts-ignore
          possibilities = possibilities.concat(monsters.filter((monster) => monster.element === 'dark' && monster.natural_grade === '5'))
        } else if(requestMonsters.includes('light-dark')) {
          // @ts-ignore
          possibilities = possibilities.concat(monsters.filter((monster) => (monster.element === 'light' || monster.element === 'dark') && monster.natural_grade === '5'))
        } else {
          possibilities = possibilities.concat(monsters.filter((monster) => requestMonsters.includes(monster.unit_master_id)))
        }

        return possibilities
      }

      let leaderBoxesPossibilities: any[] = findPossibilities(leaderMonsters)
      let secondBoxesPossibilities: any[] = findPossibilities(secondMonsters)
      let thirdBoxesPossibilities: any[] = findPossibilities(thirdMonsters)

      if(
        leaderBoxesPossibilities.length === 0 ||
        secondBoxesPossibilities.length === 0 ||
        thirdBoxesPossibilities.length === 0
      ) {
        continue
      }

      for (const leaderBox of leaderBoxesPossibilities) {
        for (const secondBox of secondBoxesPossibilities) {
          if (secondBox.unit_master_id === leaderBox.unit_master_id) continue

          for (const thirdBox of thirdBoxesPossibilities) {
            if (thirdBox.unit_master_id === leaderBox.unit_master_id || thirdBox.unit_master_id === secondBox.unit_master_id) continue

            compositions.push({
              member,
              leader: {
                unit_master_id: leaderBox.unit_master_id,
                image: leaderBox.image,
              },
              second: {
                unit_master_id: secondBox.unit_master_id,
                image: secondBox.image,
              },
              third: {
                unit_master_id: thirdBox.unit_master_id,
                image: thirdBox.image,
              }
            })
          }
        }
      }
    }

    return response.status(200).json(compositions)
  }
}
