import type { HttpContext } from '@adonisjs/core/http'
import app from "@adonisjs/core/services/app";
import {cuid} from "@adonisjs/core/helpers";
import fs from "fs";
import Box from "#models/box";
import Member from "#models/member";
import User from "#models/user";
import Monster from "#models/monster";
import {fileValidator} from "#validators/file";

export default class BoxesController {
  public async create({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(fileValidator)
    const userRole = await User
      .query()
      .where('id', user.id)
      .select('role')
      .firstOrFail()
    const memberId = params.memberId
    const member = await Member
      .query()
      .where('id', memberId)
      .firstOrFail()

    if(
      user.id !== member.user_id ||
      userRole.role !== 'leader' &&
      userRole.role !== 'moderator'
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
        const box: any = await Box
          .query()
          .where('monster_id', monster.unit_master_id)
          .andWhere('member_id', memberId)
          .first()
        const monsterExists: any = await Monster
          .query()
          .where('unit_master_id', monster.unit_master_id)
          .first()

        if(!monsterExists) {
          continue
        }

        if(box) {
          box.quantity =
            monsters.filter((m: any) => m.unit_master_id === monster.unit_master_id)
              .length
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

    const memberBoxes = await Box
      .query()
      .where('member_id', memberId)

    return response.status(201).json(memberBoxes)
  }
}
