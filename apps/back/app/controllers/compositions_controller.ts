import type { HttpContext } from '@adonisjs/core/http'
import { createCompositionValidator } from '#validators/composition'
import Member from "#models/member";
import Guild from "#models/guild";
import Composition from "#models/composition";

export default class CompositionsController {
  public async create({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(createCompositionValidator)

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator'
    ) {
      return response.forbidden()
    }

    const member = await Member.query()
      .where('user_id', user.id)
      .firstOrFail()
    const guild = await Guild.query()
      .where('id', member.guild_id)
      .firstOrFail()

    // @ts-ignore
    const composition = await Composition.create({
      name: payload.name,
      grade: payload.grade.toString(),
      guild_id: guild.id,
    })

    return response.created(composition)
  }
}
