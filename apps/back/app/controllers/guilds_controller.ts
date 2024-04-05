import type { HttpContext } from '@adonisjs/core/http'
import User from "#models/user";
import Member from "#models/member";
import Guild from "#models/guild";
import Box from "#models/box";
import Monster from "#models/monster";
import {fileValidator} from "#validators/guild";
import fs from "fs";
import app from "@adonisjs/core/services/app";
import {cuid} from "@adonisjs/core/helpers";

export default class GuildsController {
  public async show({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const memberGuild = await Member
      .query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const memberGuildId = memberGuild.guild_id
    const guildId = parseInt(params.id)

    if(guildId !== memberGuildId) {
      return response.status(403).json({ error: 'Guilde invalide' })
    }

    const guild = await Guild
      .query()
      .where('id', guildId)
      .select('name', 'image')
      .firstOrFail()
    const members = await Member
      .query()
      .where('guild_id', guildId)
      .select('id', 'pseudo', 'grade', 'user_id')
    let membersInformations = [];

    for (const member of members) {
      const user = await User
        .query()
        .where('id', member.user_id)
        .select('image')
        .first()
      const memberBox = await Box
        .query()
        .where('member_id', member.id)
      let lds: any = [];

      async function addLds(memberBox: any) {
        for (const monster of memberBox) {
          const monsterData = await Monster
            .query()
            .where('unit_master_id', monster.monster_id)
            .select('name', 'element', 'natural_grade', 'is_fusion_shop')
            .first()

          if(!monsterData) {
             continue;
          }

          if(
            // @ts-ignore
            monsterData.natural_grade === '5' &&
            monsterData.element === 'light' &&
            // @ts-ignore
            monsterData.is_fusion_shop === 0 ||
            // @ts-ignore
            monsterData.natural_grade === '5' &&
            monsterData.element === 'dark' &&
            // @ts-ignore
            monsterData.is_fusion_shop === 0
          ) {
            lds.push({
              name: monsterData.name,
              element: monsterData.element,
              quantity: monster.quantity,
            });
          }
        }
      }

      if(memberBox.length !== 0) {
        await addLds(memberBox);
      }

      if(
        user &&
        user.image
      ) {
        membersInformations.push({
          id: member.id,
          image: user.image,
          grade: member.grade,
          pseudo: member.pseudo,
          lds: lds,
        });
      } else {
        membersInformations.push({
          id: member.id,
          image: 'placeholder.jpg',
          grade: member.grade,
          pseudo: member.pseudo,
          lds: lds,
        });
      }
    }

    return response.json({
      guild,
      members: membersInformations
    })
  }

  public async create({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(fileValidator)
    const userRole = await User
      .query()
      .where('id', user.id)
      .select('role')
      .firstOrFail()
    const guild = await Guild
      .query()
      .where('leader_id', user.id)
      .first()

    if(userRole.role !== 'leader') {
      return response.status(403).json({ error: 'Vous n\'êtes pas le leader d\'une guilde' })
    }

    if(!guild) {
      return response.status(404).json({ error: 'Guilde invalide' })
    }

    const json: any = payload.json;
    await json.move(app.makePath('uploads/json'), {
      name: `${cuid()}.${json.extname}`,
    })
    const jsonLink: string = `./uploads/json/${json.fileName}`

    const data = fs.readFileSync(jsonLink, 'utf8')

    if (!data) {
      fs.unlinkSync(jsonLink)
      return response.status(500).send({message: 'Error reading json file'})
    }

    const jsonParsed: any = JSON.parse(data)

    async function createOrUpdateMembers(members: any, guildId: number, previousMembers: any) {
      for (const memberIndex of Object.keys(members)) {
        const member: any = members[memberIndex];
        const memberExists = await Member
          .query()
          .where('pseudo', member.wizard_name)
          .first()

        function getGrade(member: any) {
          if(member.grade === 2) {
            return 'member'
          } else if(member.grade === 3) {
            return 'vice-leader'
          } else if(member.grade === 4) {
            return 'senior'
          }
        }

        if(
          member.grade !== 1
          && !memberExists
        ) {
          const pseudo: string = member.wizard_name;

          await Member.create({
            pseudo: pseudo,
            grade: getGrade(member),
            guild_id: guildId,
          })
        } else if(
          member.grade !== 1 &&
          memberExists
        ) {
          // @ts-ignore
          memberExists.grade = getGrade(member)
          memberExists.guild_id = guildId
          await memberExists.save()
        }
      }

      for (const previousMember of previousMembers) {
        if(
          !members[previousMember.pseudo] &&
          previousMember.user_id !== user.id
        ) {
          await Member
            .query()
            .where('pseudo', previousMember.pseudo)
            .delete()
        }
      }
    }

    const members: any = jsonParsed.guild.guild_members
    const previousMembers = await Member
      .query()
      .where('guild_id', guild.id)

    await createOrUpdateMembers(members, guild.id, previousMembers)

    const membersNumber = Object.keys(members).length

    fs.unlinkSync(jsonLink)

    return response.created({
      message: 'Guild mates updated',
      members: membersNumber,
    })
  }
}
