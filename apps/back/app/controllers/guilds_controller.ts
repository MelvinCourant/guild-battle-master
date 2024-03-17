import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Guild from "#models/guild";

export default class GuildsController {
  public async show({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const memberGuild = await Member
      .query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const guild = await Guild
      .query()
      .where('id', memberGuild.guild_id)
      .select('name', 'image')
      .firstOrFail()

    return response.json(guild)
  }
}
