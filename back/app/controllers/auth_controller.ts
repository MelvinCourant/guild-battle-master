import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import {
  createUserValidator
} from "#validators/register_user";
import User from "#models/user";
import Member from "#models/member";
import Guild from "#models/guild";

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const userImage = request.file('user.image')

    await userImage?.move(app.makePath('uploads'), {
      name: `${cuid()}.${userImage.extname}`,
    })

    const user = await User.create({
      email: payload.user.email,
      password: payload.user.password,
      role: 'leader', // TODO: will change after member connection is implemented
      image: userImage?.fileName,
    })

    const guild = await Guild.create({
      name: payload.guild.name,
      birth_date: payload.guild.birth_date,
      leader_id: user.id,
      siege_rank: payload.guild.siege_rank,
      image: userImage?.fileName,
    })
      .catch((error) => {
        user.delete()
        throw error
      })

    await Member.create({
      pseudo: payload.member.pseudo,
      user_id: user.id,
      guild_id: guild.id,
    })
      .catch((error) => {
        user.delete()
        guild.delete()
        throw error
      })

    return response.status(201).created({ message: 'User created' })
  }

  public async login() {

  }
}
