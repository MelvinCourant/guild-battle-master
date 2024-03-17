import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Guild from "#models/guild";

export default class GuildsController {
  public async show({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const memberGuildId = await Member
      .query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const guildId = params.id

    if(guildId !== memberGuildId.guild_id) {
      return response.status(403).json({ error: 'Invalid guild' })
    }

    const guild = await Guild
      .query()
      .where('id', guildId)
      .select('name', 'image')
      .firstOrFail()
    const members = await Member
      .query()
      .where('guild_id', guildId)
      .select('pseudo', 'grade')

    return response.json({ guild, members })
  }
}
