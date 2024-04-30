import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'
import User from '#models/user'

export default class NotificationsController {
  async index({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const notifications = await Notification.query()
      .where('receiver_id', user.id)
      .select('id', 'sender_id', 'message', 'action', 'created_at')
      .orderBy('created_at', 'desc')
    const senderImages = await User.query()
      .whereIn(
        'id',
        notifications.map((n) => n.sender_id)
      )
      .select('id', 'image')

    return response.ok({
      notifications: notifications.map((n) => ({
        ...n.serialize(),
        image: senderImages.find((u) => u.id === n.sender_id)?.image,
      })),
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const notification = await Notification.findOrFail(params.id)

    if (notification.receiver_id !== user.id) {
      return response.forbidden()
    }

    await notification.delete()
    return response.noContent()
  }
}
