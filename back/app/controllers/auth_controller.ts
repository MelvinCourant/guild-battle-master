import type { HttpContext } from '@adonisjs/core/http'
import {
  createUserValidator
} from "#validators/register_user";
import User from "#models/user";
import Member from "#models/member";

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await User.create({
      email: payload.email,
      password: payload.password,
      role: 'leader', // TODO: will change after member connection is implemented
      image: payload.image,
    })

    await Member.create({
      pseudo: payload.pseudo,
      user_id: user.id
    })
      .catch((error) => {
        user.delete()
        throw error
      })

    return response.status(201).created({ message: 'User created' })
  }

  public async login() {

  }
}
