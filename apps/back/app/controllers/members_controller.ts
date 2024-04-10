import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import {fileValidator} from "#validators/file";
import app from "@adonisjs/core/services/app";
import {cuid} from "@adonisjs/core/helpers";
import fs from "fs";
import Box from "#models/box";
import Monster from "#models/monster";
import Guild from "#models/guild";
import User from "#models/user";

export default class MembersController {
  public async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const leadGuild = await Guild
      .query()
      .where('leader_id', user.id)
      .select('id')
      .firstOrFail()
    const leadGuildId = leadGuild.id
    const member = await Member
      .query()
      .where('id', params.id)
      .firstOrFail()
    const memberGuildId = member.guild_id

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator' ||
      leadGuildId !== memberGuildId
    ) {
      return response.status(403).json({ error: 'Vous n\'avez pas les droits' })
    }

    const grade = request.input('grade')

    if(
      grade !== 'leader' &&
      grade !== 'vice-leader' &&
      grade !== 'senior' &&
      grade !== 'member'
    ) {
      return response.status(400).json({ error: 'Ce rôle n\'existe pas' })
    } else if(grade === member.grade) {
      return response.status(400).json({ error: `Le membre ${member.pseudo} a déjà le rôle ${grade}` })
    } else {
      // TODO: managing the situation when the leader wants to hand over his role to another member
      // TODO: managing the situation when the member have a account to update his role
      member.grade = grade
      await member.save()
      return response.json({ message: `Le rôle ${grade} a bien été attribué à ${member.pseudo}` })
    }
  }

  public async store({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(fileValidator)
    const member = await Member
      .query()
      .where('id', params.id)
      .select('id', 'wizard_id', 'pseudo', 'user_id')
      .firstOrFail()
    const userId = await User
      .query()
      .where('id', member.user_id)
      .select('id')
      .firstOrFail()

    if(
      userId.id !== user.id ||
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator'
    ) {
      return response.status(403).json({ error: 'Vous n\'avez pas les droits' })
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
    const wizardId: number = jsonParsed.wizard_info.wizard_id
    const wizardName: string = jsonParsed.wizard_info.wizard_name
    let profilUpdated = ''

    if(wizardId !== member.wizard_id) {
      return response.status(400).json({ error: 'Le fichier ne correspond pas à votre compte' })
    }

    if(wizardName !== member.pseudo) {
      member.pseudo = wizardName
      await member.save()
      profilUpdated = ', profil mis à jour'
    }

    let monstersAdded = 0;
    let monstersUpdated = 0;

    async function updateBoxes(memberId: number, monsters: any) {
      for (const monster of monsters) {
        const box: any = await Box.query()
          .where('monster_id', monster.unit_master_id)
          .andWhere('member_id', memberId)
          .first()
        const monsterExists: any = await Monster.query()
          .where('unit_master_id', monster.unit_master_id)
          .first()
        const numberOfMonsters = monsters.filter(
          (m: any) => m.unit_master_id === monster.unit_master_id
        ).length

        if (!monsterExists) {
          continue
        }

        if (
          box &&
          box.quantity !== numberOfMonsters
        ) {
          box.quantity = numberOfMonsters
          await box.save()
          monstersUpdated += numberOfMonsters
        } else if(!box) {
          await Box.create({
            monster_id: monster.unit_master_id,
            member_id: memberId,
            quantity: numberOfMonsters,
            monsters_assigned: 0,
          })
          monstersAdded += numberOfMonsters
        }
      }
    }

    const monsters: any = jsonParsed.unit_list
    await updateBoxes(member.id, monsters)

    fs.unlinkSync(jsonLink)

    let monsterAddedMessage = ''
    let monsterUpdatedMessage = ''

    if(monstersAdded > 1) {
      monsterAddedMessage = `${monstersAdded} monstres ajoutés`
    } else if(monstersAdded === 1) {
      monsterAddedMessage = '1 monstre ajouté'
    } else {
      monsterAddedMessage = 'Aucun monstre ajouté'
    }

    if(monstersUpdated > 1) {
      monsterUpdatedMessage = `${monstersUpdated} monstres mis à jour`
    } else if(monstersUpdated === 1) {
      monsterUpdatedMessage = '1 monstre mis à jour'
    } else {
      monsterUpdatedMessage = 'Aucun monstre mis à jour'
    }

    return response.json({
      message: `Le fichier a bien été traité. ${monsterAddedMessage}, ${monsterUpdatedMessage} mis à jour ${profilUpdated}`
    })
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const userMember = await Member
      .query()
      .where('user_id', user.id)
      .select('id')
      .firstOrFail()
    const leadGuild = await Guild
      .query()
      .where('leader_id', user.id)
      .select('id')
      .firstOrFail()
    const leadGuildId = leadGuild.id
    const member = await Member
      .query()
      .where('id', params.id)
      .firstOrFail()
    const memberGuildId = member.guild_id
    const memberRole = await User
      .query()
      .where('id', member.user_id)
      .select('role')

    if(
      user.role !== 'admin' && user.role !== 'leader' && user.role !== 'moderator' ||
      leadGuildId !== memberGuildId ||
      userMember.id === member.id ||
      user.role === 'moderator' && memberRole.role === 'moderator' ||
      user.role === 'moderator' && memberRole.role === 'leader' ||
      user.role === 'leader' && memberRole.role === 'leader'
    ) {
      return response.status(403).json({ error: 'Vous n\'avez pas les droits' })
    }

    // @ts-ignore
    member.guild_id = null
    await member.save()
    return response.json({ message: `Le membre ${member.pseudo} a bien été exclu de la guilde` })
  }
}
