import type { HttpContext } from '@adonisjs/core/http'
import Token from '#models/token'
import stringHelpers from '@adonisjs/core/helpers/string'
import User from '#models/user'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/reset_password'
import env from '#start/env'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class ResetPasswordController {
  async forgotPassword({ i18n, request, response }: HttpContext) {
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
          .subject(i18n.t('messages.password_reset_request'))
          .html(
            `<h1>${i18n.t('messages.password_reset_request')}</h1>` +
              `<p>${i18n.t('messages.password_reset_request_email')}</p>` +
              `<a href="${url}">${i18n.t('messages.password_reset')}</a>`
          )
      })

      return response.status(200).send({
        message: i18n.t('messages.email_has_send_email_adress'),
      })
    }

    return response.status(404).send({
      message: i18n.t('messages.no_users_found_with_email_address'),
    })
  }

  async verifyUrl({ i18n, request, response }: HttpContext) {
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
        message: i18n.t('messages.link_expired_invalid'),
      })
    }

    return response.status(200).send({
      token,
      email,
    })
  }

  async resetPassword({ i18n, request, response }: HttpContext) {
    const payload = await request.validateUsing(resetPasswordValidator)
    const { token, email } = payload
    const tokenObj = await Token.query().where('token', token).first()

    if (
      !tokenObj ||
      tokenObj.email !== email ||
      tokenObj.expiresAt < DateTime.now() ||
      // @ts-ignore
      tokenObj.isUsed === 1
    ) {
      return response.status(400).send({
        message: i18n.t('messages.link_expired_invalid'),
      })
    }

    const user = await User.query().where('email', email).first()

    if (!user) {
      return response.status(404).send({
        message: i18n.t('messages.operation_impossible'),
      })
    }

    tokenObj.isUsed = true
    await tokenObj.save()
    user.password = payload.password
    await user.save()
  }
}
