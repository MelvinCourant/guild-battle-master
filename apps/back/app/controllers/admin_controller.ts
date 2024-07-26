import type { HttpContext } from '@adonisjs/core/http'
import Guild from '#models/guild'
import Member from '#models/member'
import User from '#models/user'

export default class AdminController {
  async listGuilds({ i18n, auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const guilds = await Guild.all()
    let guildsData = []

    for (let guild of guilds) {
      const leader = await Member.query().where('user_id', guild.leader_id).firstOrFail()

      guildsData.push({
        guild: {
          id: guild.id,
          guild_id_json: guild.guild_id_json,
          name: guild.name,
          leader_id: guild.leader_id,
          image: guild.image,
          created_at: guild.createdAt,
        },
        leader: {
          user_id: leader.user_id,
          pseudo: leader.pseudo,
        },
      })
    }

    return response.json(guildsData)
  }

  async listUsers({ i18n, auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const users = await User.query().where('role', '!=', 'admin')
    let usersData = []

    for (let user of users) {
      const userInfos = {
        id: user.id,
        username: user.username,
        image: user.image,
        created_at: user.createdAt,
      }
      const member = await Member.query()
        .where('user_id', user.id)
        .select('id', 'pseudo', 'guild_id')
        .first()

      if (!member) {
        usersData.push({
          user: userInfos,
          member: null,
        })
        continue
      }

      const guild = await Guild.query().where('id', member.guild_id).firstOrFail()

      usersData.push({
        user: {
          id: user.id,
          username: user.username,
          image: user.image,
          created_at: user.createdAt,
        },
        member: {
          id: member.id,
          pseudo: member.pseudo,
        },
        guild: {
          id: guild.id,
          name: guild.name,
        },
      })
    }

    return response.json(usersData)
  }
}
