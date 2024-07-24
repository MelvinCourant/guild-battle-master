import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Member from '#models/member'
import Notification from '#models/notification'
import Guild from '#models/guild'
import { imgValidator } from '#validators/file'
import fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class UsersController {
  async verify({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user) {
      const userInfos = await User.query()
        .where('id', user.id)
        .select('email', 'username', 'role', 'image')
        .firstOrFail()
      const member = await Member.query()
        .where('user_id', user.id)
        .select('id', 'pseudo', 'guild_id')
        .firstOrFail()

      let userImage = 'placeholder.jpg'

      if (userInfos.image) {
        userImage = userInfos.image
      }

      return response.status(200).send({
        user: {
          email: userInfos.email,
          username: userInfos.username,
          role: userInfos.role,
          image: userImage,
          member_id: member.id,
          guild_id: member.guild_id,
        },
      })
    }
    return response.unauthorized()
  }

  async bequeathLeader({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const receiverMember = await Member.query()
      .where('user_id', user.id)
      .select('pseudo', 'guild_id')
      .firstOrFail()
    const notificationId = request.input('notification_id')
    const notification = await Notification.query().where('id', notificationId).firstOrFail()
    const sender = await User.query().where('id', notification.sender_id).firstOrFail()
    const senderMember = await Member.query()
      .where('user_id', sender.id)
      .select('pseudo')
      .firstOrFail()
    const guild = await Guild.query()
      .where('leader_id', sender.id)
      .select('id', 'image', 'leader_id')
      .firstOrFail()

    if (
      notification.receiver_id !== user.id ||
      notification.sender_id !== sender.id ||
      notification.action !== 'bequeath_leader' ||
      guild.leader_id !== sender.id ||
      receiverMember.guild_id !== guild.id
    ) {
      return response.status(400).json({ message: 'Action invalide' })
    }

    const accept = request.input('accept')

    if (accept) {
      guild.leader_id = user.id
      // @ts-ignore
      guild.image = user.image
      await guild.save()

      user.role = 'leader'
      await user.save()

      sender.role = 'member'
      await sender.save()

      notification.message = `${senderMember.pseudo} vous a légué le rôle de leader`
      notification.action = null
      await notification.save()

      await Notification.create({
        sender_id: user.id,
        receiver_id: sender.id,
        message: `${receiverMember.pseudo} a accepté de devenir leader`,
      })

      return response.json({ message: `Vous êtes désormais le leader de la guilde` })
    } else {
      notification.message = 'Vous avez refusé de devenir leader'
      notification.action = null
      await notification.save()

      await Notification.create({
        sender_id: user.id,
        receiver_id: sender.id,
        message: `${receiverMember.pseudo} a refusé de devenir leader`,
      })

      return response.json({ message: `Vous avez refusé de devenir leader` })
    }
  }

  async updateProfile({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(imgValidator)
    const image = payload.image

    if (image) {
      const oldImage = user.image

      if (oldImage) {
        fs.unlinkSync(`./uploads/${oldImage}`)
      }

      await image.move(app.makePath('uploads'), {
        name: `${cuid()}.${image.extname}`,
      })
      // @ts-ignore
      user.image = image.fileName
      await user.save()

      if (user.role === 'leader') {
        const guild = await Guild.query().where('leader_id', user.id).select('id').firstOrFail()
        // @ts-ignore
        guild.image = image.fileName
        await guild.save()
      }
    }

    return response.json({ message: 'Profil mis à jour' })
  }
}
