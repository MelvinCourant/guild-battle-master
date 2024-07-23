import type { HttpContext } from '@adonisjs/core/http'
import Token from '#models/token'
import stringHelpers from '@adonisjs/core/helpers/string'
import User from '#models/user'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/reset_password'
import env from '#start/env'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class ResetPasswordController {
  async forgotPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(forgotPasswordValidator)
    const email = payload.email
    const user = await User.query().where('email', email).first()

    if (user) {
      const token = stringHelpers.generateRandom(64)
      const url = `${env.get('FRONT_URL')}/reset-password?token=${token}&email=${email}`

      await Token.create({
        token,
        email: user.email,
        expiresAt: DateTime.now().plus({ minutes: 20 }),
      })

      await mail.send((message) => {
        message
          .to(user.email)
          .from('no-reply@guildbattlemaster.com')
          .subject('Demande de réinitialisation de mot de passe')
          .html(
            '<h1>Demande de réinitilisation de mot de passe</h1>' +
              '<p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le réinitialiser.</p>' +
              `<a href="${url}">Réinitialiser mon mot de passe</a>`
          )
      })

      return response.status(200).send({
        message: 'Un email vous a été envoyé à votre adresse email',
      })
    }

    return response.status(404).send({
      message: 'Aucun utilisateur trouvé avec cette adresse email',
    })
  }

  async verifyUrl({ request, response }: HttpContext) {
    const { email, token } = request.only(['email', 'token'])
    const tokenObj = await Token.query().where('token', token).first()

    if (
      !tokenObj ||
      tokenObj.email !== email ||
      tokenObj.expiresAt < DateTime.now() ||
      // @ts-ignore
      tokenObj.isUsed === 1
    ) {
      return response.status(400).send({
        message: 'Lien expiré ou invalide',
      })
    }

    return response.status(200).send({
      token,
      email,
    })
  }

  async resetPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(resetPasswordValidator)
    const { token, email } = payload
    const tokenObj = await Token.query().where('token', token).first()
    console.log(tokenObj)

    if (
      !tokenObj ||
      tokenObj.email !== email ||
      tokenObj.expiresAt < DateTime.now() ||
      // @ts-ignore
      tokenObj.isUsed === 1
    ) {
      return response.status(400).send({
        message: 'Lien expiré ou invalide',
      })
    }

    const user = await User.query().where('email', email).first()

    if (!user) {
      return response.status(404).send({
        message: 'Opération impossible',
      })
    }

    tokenObj.isUsed = true
    await tokenObj.save()
    user.password = payload.password
    await user.save()
  }
}
