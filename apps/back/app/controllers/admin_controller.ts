import type { HttpContext } from '@adonisjs/core/http'
import Guild from '#models/guild'
import Member from '#models/member'

export default class AdminController {
  async listGuilds({ i18n, auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const guilds = await Guild.all()
    let guildsDatas = []

    for (let guild of guilds) {
      const leader = await Member.query().where('user_id', guild.leader_id).firstOrFail()

      guildsDatas.push({
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

    return response.json(guildsDatas)
  }
}
