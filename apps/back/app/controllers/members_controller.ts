import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";

export default class MembersController {
  public async index({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const memberGuild = await Member
      .query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const members = await Member
      .query()
      .where('guild_id', memberGuild.guild_id)
      .select('pseudo', 'grade')

    return response.json(members)
  }
}
