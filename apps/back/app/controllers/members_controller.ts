import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'
import { fileValidator } from '#validators/file'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs'
import Box from '#models/box'
import Monster from '#models/monster'
import Guild from '#models/guild'
import User from '#models/user'
import Notification from '#models/notification'

export default class MembersController {
  async show({ auth, params, response }: HttpContext) {
    await auth.authenticate()

    const member = await Member.query()
      .where('id', params.id)
      .select('pseudo', 'grade', 'user_id')
      .firstOrFail()
    const box = await Box.query().where('member_id', params.id).select('monster_id', 'quantity')
    const monsters = await Monster.query()
      .whereIn(
        'unit_master_id',
        box.map((b) => b.monster_id)
      )
      .select('unit_master_id', 'name', 'element', 'natural_grade', 'image', 'is_fusion_shop')
    let monstersWithQuantity: any[] = []

    for (const monster of monsters) {
      // @ts-ignore
      const quantity = box.find((b) => b.monster_id === monster.unit_master_id).quantity
      monstersWithQuantity.push({
        name: monster.name,
        element: monster.element,
        natural_grade: monster.natural_grade,
        image: monster.image,
        is_fusion_shop: monster.is_fusion_shop,
        quantity: quantity,
      })
    }

    const elementsOrder = ['fire', 'water', 'wind', 'light', 'dark']
    monstersWithQuantity = monstersWithQuantity.sort((a, b) => {
      if (a.element === b.element) {
        return b.natural_grade - a.natural_grade
      }
      return elementsOrder.indexOf(a.element) - elementsOrder.indexOf(b.element)
    })

    let image = 'placeholder.jpg'

    const userParams = await User.query().where('id', member.user_id).select('image').first()

    if (userParams && userParams.image) {
      image = userParams.image
    }

    return response.json({
      member: {
        pseudo: member.pseudo,
        grade: member.grade,
        image: image,
      },
      monsters: monstersWithQuantity,
    })
  }

  async verifyUploadPermissions({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const userMember = await Member.query()
      .where('user_id', user.id)
      .select('id', 'guild_id')
      .firstOrFail()
    const memberParams = await Member.query()
      .where('id', params.id)
      .select('id', 'pseudo', 'user_id', 'guild_id')
      .firstOrFail()
    const userMemberParams = await User.query().where('id', memberParams.user_id).select('role')

    function returnError() {
      return response.status(403).json({ message: "Vous n'avez pas les droits" })
    }

    if (user.role !== 'admin' && userMember.guild_id !== memberParams.guild_id) {
      return returnError()
    } else if (
      user.role === 'moderator' &&
      userMemberParams.role === 'moderator' &&
      userMember.id !== memberParams.id
    ) {
      return returnError()
    } else if (user.role === 'moderator' && userMemberParams.role === 'leader') {
      return returnError()
    } else if (
      user.role === 'leader' &&
      userMemberParams.role === 'leader' &&
      userMember.id !== memberParams.id
    ) {
      return returnError()
    } else if (user.role === 'member' && userMember.id !== memberParams.id) {
      return returnError()
    }

    const pseudo = memberParams.pseudo
    return response.json({
      message: `Vous avez les droits pour uploader le fichier`,
      pseudo: pseudo,
    })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const applicantMember = await Member.query()
      .where('user_id', user.id)
      .select('id', 'pseudo', 'guild_id')
      .firstOrFail()
    const applicantGuildId = applicantMember.guild_id
    const member = await Member.query()
      .where('id', params.id)
      .select('pseudo', 'guild_id', 'user_id')
      .firstOrFail()
    const memberGuildId = member.guild_id
    const userMember = await User.query().where('id', member.user_id).firstOrFail()

    const role = request.input('role')

    if ((user.role !== 'admin' && user.role !== 'leader') || applicantGuildId !== memberGuildId) {
      return response.status(403).json({ message: "Vous n'avez pas les droits" })
    }

    if (role !== 'leader' && role !== 'moderator' && role !== 'member') {
      return response.status(400).json({ message: "Ce rôle n'existe pas" })
    } else if (role === userMember.role) {
      return response
        .status(400)
        .json({ message: `Le membre ${member.pseudo} a déjà le rôle ${role}` })
    } else if (role === 'leader' && user.role === 'leader') {
      await Notification.create({
        sender_id: user.id,
        receiver_id: member.user_id,
        message: `${applicantMember.pseudo} veut vous léguer le rôle leader`,
        action: 'bequeath_leader',
      })

      return response.json({
        message: `Une notification a été envoyée à ${member.pseudo}`,
      })
    } else {
      userMember.role = role
      await userMember.save()
      return response.json({ message: `Le rôle ${role} a bien été attribué à ${member.pseudo}` })
    }
  }

  async store({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(fileValidator)
    const userMember = await Member.query()
      .where('user_id', user.id)
      .select('id', 'guild_id')
      .firstOrFail()
    const memberParams = await Member.query()
      .where('id', params.id)
      .select('id', 'wizard_id', 'pseudo', 'user_id', 'guild_id')
      .firstOrFail()
    const userMemberParams = await User.query().where('id', memberParams.user_id).select('role')

    function returnError() {
      return response.status(403).json({ message: "Vous n'avez pas les droits" })
    }

    if (user.role !== 'admin' && userMember.guild_id !== memberParams.guild_id) {
      return returnError()
    } else if (
      user.role === 'moderator' &&
      userMemberParams.role === 'moderator' &&
      userMember.id !== memberParams.id
    ) {
      return returnError()
    } else if (user.role === 'moderator' && userMemberParams.role === 'leader') {
      return returnError()
    } else if (
      user.role === 'leader' &&
      userMemberParams.role === 'leader' &&
      userMember.id !== memberParams.id
    ) {
      return returnError()
    } else if (user.role === 'member' && userMember.id !== memberParams.id) {
      return returnError()
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
    let profileUpdated = ''

    if (wizardId !== memberParams.wizard_id) {
      return response.status(400).json({ message: 'Le fichier ne correspond pas à votre compte' })
    }

    if (wizardName !== memberParams.pseudo) {
      memberParams.pseudo = wizardName
      await memberParams.save()
      profileUpdated = ', profil mis à jour'
    }

    let monstersAdded = 0
    let monstersUpdated = 0

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

        if (box && box.quantity !== numberOfMonsters) {
          box.quantity = numberOfMonsters
          await box.save()
          monstersUpdated += numberOfMonsters
        } else if (!box) {
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
    await updateBoxes(memberParams.id, monsters)

    fs.unlinkSync(jsonLink)

    let monsterAddedMessage = ''
    let monsterUpdatedMessage = ''

    if (monstersAdded > 1) {
      monsterAddedMessage = `${monstersAdded} monstres ajoutés`
    } else if (monstersAdded === 1) {
      monsterAddedMessage = '1 monstre ajouté'
    } else {
      monsterAddedMessage = 'Aucun monstre ajouté'
    }

    if (monstersUpdated > 1) {
      monsterUpdatedMessage = `${monstersUpdated} monstres mis à jour`
    } else if (monstersUpdated === 1) {
      monsterUpdatedMessage = '1 monstre mis à jour'
    } else {
      monsterUpdatedMessage = 'aucun monstre mis à jour'
    }

    return response.json({
      message: `Le fichier a bien été traité. ${monsterAddedMessage}, ${monsterUpdatedMessage} ${profileUpdated}`,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const userMember = await Member.query().where('user_id', user.id).select('id').firstOrFail()
    const leadGuild = await Guild.query().where('leader_id', user.id).select('id').firstOrFail()
    const leadGuildId = leadGuild.id
    const member = await Member.query().where('id', params.id).firstOrFail()
    const memberGuildId = member.guild_id
    const memberRole = await User.query().where('id', member.user_id).select('role')

    if (
      (user.role !== 'admin' && user.role !== 'leader' && user.role !== 'moderator') ||
      leadGuildId !== memberGuildId ||
      userMember.id === member.id ||
      (user.role === 'moderator' && memberRole.role === 'moderator') ||
      (user.role === 'moderator' && memberRole.role === 'leader') ||
      (user.role === 'leader' && memberRole.role === 'leader')
    ) {
      return response.status(403).json({ message: "Vous n'avez pas les droits" })
    }

    // @ts-ignore
    member.guild_id = null
    await member.save()
    return response.json({ message: `Le membre ${member.pseudo} a bien été exclu de la guilde` })
  }
}
