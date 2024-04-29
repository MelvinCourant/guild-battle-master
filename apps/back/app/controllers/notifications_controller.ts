import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
  async index({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const notifications = await Notification.query()
      .where('receiver_id', user.id)
      .select('sender_id', 'message', 'action', 'created_at')
      .orderBy('created_at', 'desc')

    return response.ok(notifications)
  }
}
