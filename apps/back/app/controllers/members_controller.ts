import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Guild from "#models/guild";
import User from "#models/user";

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
      user.role !== 'leader' &&
      user.role !== 'moderator' ||
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
    const userMember = await Member
      .query()
      .where('user_id', user.id)
      .select('id')
      .firstOrFail()
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
    const memberRole = await User
      .query()
      .where('id', member.user_id)
      .select('role')

    if(
      user.role !== 'admin' && user.role !== 'leader' && user.role !== 'moderator' ||
      leadGuildId !== memberGuildId ||
      userMember.id === member.id ||
      user.role === 'moderator' && memberRole.role === 'moderator' ||
      user.role === 'moderator' && memberRole.role === 'leader' ||
      user.role === 'leader' && memberRole.role === 'leader'
    ) {
      return response.status(403).json({ error: 'Vous n\'avez pas les droits' })
    }

    // @ts-ignore
    member.guild_id = null
    await member.save()
    return response.json({ message: `Le membre ${member.pseudo} a bien été exclu de la guilde` })
  }
}
