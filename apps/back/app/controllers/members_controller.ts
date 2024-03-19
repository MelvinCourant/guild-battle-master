import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Guild from "#models/guild";

export default class MembersController {
  public async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const leadGuild = await Guild
      .query()
      .where('leader_id', user.id)
      .select('id')
      .firstOrFail()
    const leadGuildId = leadGuild.id
    const member = await Member
      .query()
      .where('id', params.id)
      .firstOrFail()
    const memberGuildId = member.guild_id

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' ||
      leadGuildId !== memberGuildId
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
      // TODO: managing the situation when the leader wants to hand over his role to another member
      // TODO: managing the situation when the member have a account to update his role
      member.grade = grade
      await member.save()
      return response.json({ message: `Le rôle ${grade} a bien été attribué à ${member.pseudo}` })
    }
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const leadGuild = await Guild
      .query()
      .where('leader_id', user.id)
      .select('id')
      .firstOrFail()
    const leadGuildId = leadGuild.id
    const member = await Member
      .query()
      .where('id', params.id)
      .firstOrFail()
    const memberGuildId = member.guild_id

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' ||
      leadGuildId !== memberGuildId
    ) {
      return response.status(403).json({ error: 'Vous n\'avez pas les droits' })
    }

    // @ts-ignore
    member.guild_id = null
    await member.save()
    return response.json({ message: `Le membre ${member.pseudo} a bien été exclu de la guilde` })
  }
}
