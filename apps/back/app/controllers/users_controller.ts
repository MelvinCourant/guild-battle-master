import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Member from '#models/member'

export default class UsersController {
  public async verify({ auth, response }: HttpContext) {
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

      return response.status(200).send({
        user: {
          email: userInfos.email,
          username: userInfos.username,
          role: userInfos.role,
          image: userInfos.image,
          member_id: member.id,
          guild_id: member.guild_id,
        },
      })
    }
    return response.unauthorized()
  }
}