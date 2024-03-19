import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Guild from "#models/guild";

export default class MembersController {
  public async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const leadGuildId = await Guild
      .query()
      .where('leader_id', user.id)
      .select('id')
      .firstOrFail()
    const member = await Member
      .query()
      .where('id', params.id)
      .firstOrFail()

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' ||
      leadGuildId.id !== member.guild_id
    ) {
      return response.status(403).json({ error: 'Vous n\'avez pas les droits' })
    }

    const grade = request.input('grade')

    if(
      grade !== 'leader' &&
      grade !== 'vice-leader' &&
      grade !== 'senior' &&
      grade !== 'member'
    ) {
      return response.status(400).json({ error: 'Ce rôle n\'existe pas' })
    } else if(grade === member.grade) {
      return response.status(400).json({ error: `Le membre ${member.pseudo} a déjà le rôle ${grade}` })
    } else {
      member.grade = grade
      await member.save()
      return response.json({ message: `Le rôle ${grade} a bien été attribué à ${member.pseudo}` })
    }
  }
}
