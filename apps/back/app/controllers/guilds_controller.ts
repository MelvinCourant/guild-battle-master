import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Guild from "#models/guild";

export default class GuildsController {
  public async show({ auth, params, response }: HttpContext) {
    await auth.authenticate()
    const guildId = params.id
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
