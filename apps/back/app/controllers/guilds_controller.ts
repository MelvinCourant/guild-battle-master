import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Member from '#models/member'
import Guild from '#models/guild'
import Box from '#models/box'
import Monster from '#models/monster'
import { fileValidator } from '#validators/guild'
import fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class GuildsController {
  async show({ i18n, auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const memberGuild = await Member.query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const memberGuildId = memberGuild.guild_id
    const guildId = params.id

    if (guildId !== memberGuildId) {
      return response.status(403).json({ message: i18n.t('messages.guild_invalid_not_exist') })
    }

    const guild = await Guild.query().where('id', guildId).select('name', 'image').firstOrFail()
    const members = await Member.query()
      .where('guild_id', guildId)
      .select('id', 'pseudo', 'grade', 'user_id')
    let membersInformations = []

    for (const member of members) {
      const userMember = await User.query()
        .where('id', member.user_id)
        .select('image', 'role')
        .first()
      const memberBox = await Box.query().where('member_id', member.id)
      let lds: any = []
      let memberInformations: any = {
        id: member.id,
        image: 'placeholder.jpg',
        pseudo: member.pseudo,
        grade: member.grade,
        role: '',
        lds: [],
      }

      if (userMember && userMember.role) {
        memberInformations.role = userMember.role
      }

      // eslint-disable-next-line no-inner-declarations
      async function addLds() {
        for (const monster of memberBox) {
          const monsterData = await Monster.query()
            .where('unit_master_id', monster.monster_id)
            .select('unit_master_id', 'name', 'element', 'natural_grade', 'is_fusion_shop')
            .first()

          if (!monsterData) {
            continue
          }

          if (
            // @ts-ignore
            (monsterData.natural_grade === '5' &&
              monsterData.element === 'light' &&
              // @ts-ignore
              monsterData.is_fusion_shop === 0) ||
            // @ts-ignore
            (monsterData.natural_grade === '5' &&
              monsterData.element === 'dark' &&
              // @ts-ignore
              monsterData.is_fusion_shop === 0)
          ) {
            lds.push({
              unit_master_id: monsterData.unit_master_id,
              name: monsterData.name,
              element: monsterData.element,
              quantity: monster.quantity,
            })
          }
        }

        memberInformations.lds = lds
      }

      if (memberBox.length !== 0) {
        await addLds()
      }

      if (userMember) {
        if (userMember.image) {
          memberInformations.image = userMember.image
        }

        if (userMember.role && userMember.role !== 'member') {
          memberInformations.role = userMember.role
        }
      }

      membersInformations.push(memberInformations)
    }

    const gradeOrder = ['leader', 'vice-leader', 'senior', 'member']

    membersInformations = membersInformations.sort((a: any, b: any) => {
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade)
    })

    let guildImage = 'placeholder.jpg'

    if (guild.image) {
      guildImage = guild.image
    }

    return response.json({
      guild: {
        name: guild.name,
        image: guildImage,
      },
      members: membersInformations,
    })
  }

  async create({ i18n, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(fileValidator)
    const userRole = await User.query().where('id', user.id).select('role').firstOrFail()
    const guild = await Guild.query().where('leader_id', user.id).first()

    if (userRole.role !== 'leader' && userRole.role !== 'moderator') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    if (!guild) {
      return response.status(404).json({ message: i18n.t('messages.guild_invalid_not_exist') })
    }

    const json: any = payload.json
    await json.move(app.makePath('uploads/json'), {
      name: `${cuid()}.${json.extname}`,
    })
    const jsonLink: string = `./uploads/json/${json.fileName}`

    const data = fs.readFileSync(jsonLink, 'utf8')

    if (!data) {
      fs.unlinkSync(jsonLink)
      return response.status(500).send({ message: i18n.t('messages.error_reading_json_file') })
    }

    const jsonParsed: any = JSON.parse(data)

    // eslint-disable-next-line no-inner-declarations
    async function createOrUpdateMembers(members: any, guildId: string, previousMembers: any) {
      for (const memberIndex of Object.keys(members)) {
        const member: any = members[memberIndex]
        const memberExists = await Member.query().where('wizard_id', member.wizard_id).first()

        // eslint-disable-next-line no-inner-declarations
        function getGrade() {
          if (member.grade === 1) {
            return 'leader'
          } else if (member.grade === 2) {
            return 'member'
          } else if (member.grade === 3) {
            return 'vice-leader'
          } else if (member.grade === 4) {
            return 'senior'
          }
        }

        if (!memberExists) {
          const pseudo: string = member.wizard_name

          await Member.create({
            wizard_id: member.wizard_id,
            pseudo: pseudo,
            grade: getGrade(),
            guild_id: guildId,
          })
        } else if (memberExists) {
          // @ts-ignore
          memberExists.grade = getGrade()
          memberExists.guild_id = guildId
          await memberExists.save()
        }
      }

      for (const previousMember of previousMembers) {
        if (!members[previousMember.wizard_id] && previousMember.user_id !== user.id) {
          await Member.query().where('wizard_id', previousMember.wizard_id).delete()
        }
      }
    }

    const members: any = jsonParsed.guild.guild_members
    const previousMembers = await Member.query().where('guild_id', guild.id)

    await createOrUpdateMembers(members, guild.id, previousMembers)

    const membersNumber = Object.keys(members).length

    fs.unlinkSync(jsonLink)

    return response.created({
      message: i18n.t('messages.guild_mates_updated'),
      members: membersNumber,
    })
  }

  async search({ i18n, auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const keyword = decodeURIComponent(request.input('keyword'))
    const memberGuild = await Member.query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const memberGuildId = memberGuild.guild_id
    const guildId = params.id
    const sort = request.input('sort')

    if (guildId !== memberGuildId) {
      return response.status(403).json({ message: i18n.t('messages.guild_invalid_not_exist') })
    }

    let members: any
    let membersInformations = []

    if (!keyword) {
      members = await Member.query()
        .where('guild_id', guildId)
        .select('id', 'pseudo', 'grade', 'user_id')
    } else {
      members = await Member.query()
        .where('guild_id', guildId)
        .where('pseudo', 'like', `%${keyword}%`)
        .orWhere('grade', 'like', `%${keyword}%`)
        .select('id', 'pseudo', 'grade', 'user_id')

      if (members.length === 0) {
        const monsters = await Monster.query()
          .where('name', 'like', `%${keyword}%`)
          .select('unit_master_id')
        const boxes = await Box.query()
          .whereIn(
            'monster_id',
            monsters.map((monster: any) => monster.unit_master_id)
          )
          .select('member_id')

        if (monsters.length === 0) {
          const users = await User.query().where('role', 'like', `%${keyword}%`).select('id')

          members = await Member.query()
            .whereIn(
              'user_id',
              users.map((u: any) => u.id)
            )
            .select('id', 'pseudo', 'grade', 'user_id')
        } else {
          members = await Member.query()
            .whereIn(
              'id',
              boxes.map((b: any) => b.member_id)
            )
            .select('id', 'pseudo', 'grade', 'user_id')
        }
      }
    }

    for (const member of members) {
      const userMember = await User.query()
        .where('id', member.user_id)
        .select('image', 'role')
        .first()
      const memberBox = await Box.query().where('member_id', member.id)
      let lds: any = []
      let memberInformations: any = {
        id: member.id,
        image: 'placeholder.jpg',
        pseudo: member.pseudo,
        grade: member.grade,
        role: '',
        lds: [],
      }

      // eslint-disable-next-line no-inner-declarations
      async function addLds() {
        for (const monster of memberBox) {
          const monsterData = await Monster.query()
            .where('unit_master_id', monster.monster_id)
            .select('id', 'name', 'element', 'natural_grade', 'is_fusion_shop')
            .first()

          if (!monsterData) {
            continue
          }

          if (
            // @ts-ignore
            (monsterData.natural_grade === '5' &&
              monsterData.element === 'light' &&
              // @ts-ignore
              monsterData.is_fusion_shop === 0) ||
            // @ts-ignore
            (monsterData.natural_grade === '5' &&
              monsterData.element === 'dark' &&
              // @ts-ignore
              monsterData.is_fusion_shop === 0)
          ) {
            lds.push({
              id: monsterData.id,
              name: monsterData.name,
              element: monsterData.element,
              quantity: monster.quantity,
            })
          }
        }

        memberInformations.lds = lds
      }

      if (memberBox.length !== 0) {
        await addLds()
      }

      if (userMember) {
        if (userMember.image) {
          memberInformations.image = userMember.image
        }

        if (userMember.role && userMember.role !== 'member') {
          memberInformations.role = userMember.role
        }
      }

      membersInformations.push(memberInformations)
    }

    if (sort.name !== 'grade') {
      if (sort.name === 'pseudo') {
        if (sort.order === 'desc') {
          membersInformations = membersInformations.sort((a: any, b: any) => {
            return b.pseudo.localeCompare(a.pseudo)
          })
        } else {
          membersInformations = membersInformations.sort((a: any, b: any) => {
            return a.pseudo.localeCompare(b.pseudo)
          })
        }
      } else if (sort.name === 'lds') {
        if (sort.order === 'desc') {
          membersInformations = membersInformations.sort((a: any, b: any) => {
            return b.lds.length - a.lds.length
          })
        } else {
          membersInformations = membersInformations.sort((a: any, b: any) => {
            return a.lds.length - b.lds.length
          })
        }
      }
    } else {
      const gradeOrder = ['leader', 'vice-leader', 'senior', 'member']

      if (sort.order === 'desc') {
        membersInformations = membersInformations.sort((a: any, b: any) => {
          return gradeOrder.indexOf(b.grade) - gradeOrder.indexOf(a.grade)
        })
      } else {
        membersInformations = membersInformations.sort((a: any, b: any) => {
          return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade)
        })
      }
    }

    return response.json({ members: membersInformations })
  }
}
