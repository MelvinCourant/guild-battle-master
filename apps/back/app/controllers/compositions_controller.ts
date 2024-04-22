import type { HttpContext } from '@adonisjs/core/http'
import { createCompositionValidator } from '#validators/composition'
import Member from "#models/member";
import Guild from "#models/guild";
import Composition from "#models/composition";
import Defense from "#models/defense";
import Monster from "#models/monster";
import Box from "#models/box";

export default class CompositionsController {
  public async create({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(createCompositionValidator)

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator'
    ) {
      return response.forbidden()
    }

    const member = await Member.query()
      .where('user_id', user.id)
      .firstOrFail()
    const guild = await Guild.query()
      .where('id', member.guild_id)
      .firstOrFail()

    // @ts-ignore
    const composition = await Composition.create({
      name: payload.name,
      grade: payload.grade.toString(),
      guild_id: guild.id,
    })

    for (const defense of payload.defenses) {
      const memberAssigned = await Member.query()
        .where('id', defense.member)
        .firstOrFail()
      const defenseAssigned = await Defense.create({
        composition_id: composition.id,
        member_id: defense.member,
        leader_monster: defense.leader,
        second_monster: defense.second,
        third_monster: defense.third
      })
      let boxMemberAssigned = await Box.query()
        .where('member_id', memberAssigned.id)
        .andWhere('monster_id', defenseAssigned.leader_monster)
        .orWhere('monster_id', defenseAssigned.second_monster)
        .orWhere('monster_id', defenseAssigned.third_monster)

      boxMemberAssigned.forEach((box) => {
        box.monsters_assigned++
        box.save()
      })
    }

    return response.created({ message: 'Composition créée avec succès' })
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()

    if(
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator'
    ) {
      return response.forbidden()
    }

    const composition = await Composition.query()
      .where('id', params.id)
      .firstOrFail()

    await composition.delete()

    return response.noContent()
  }

  public async search({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const guildId = params.guildId
    const guild = await Guild.query()
      .where('id', guildId)
      .first()
    const userMember = await Member.query()
      .where('user_id', user.id)
      .firstOrFail()
    const userGuild = await Guild.query()
      .where('id', userMember.guild_id)
      .firstOrFail()

    if(
      !guild ||
      userGuild.id !== guild.id
    ) {
      return response.status(404).send({ error: 'La guilde est invalide ou n\'existe pas' })
    }

    const compositions = await Composition.query()
      .where('guild_id', guild.id)
      .select('id', 'name', 'grade')
      .orderBy('grade', 'desc')
    let compositionsData = []

    for (const composition of compositions) {
      const defenses = await Defense.query()
        .where('composition_id', composition.id)
        .select('id', 'leader_monster', 'second_monster', 'third_monster', 'member_id')
      let defensesData = []

      if(defenses.length === 0) {
        compositionsData.push({
          id: composition.id,
          name: composition.name,
          grade: composition.grade,
          defenses: []
        })

        continue
      }

      for (const defense of defenses) {
        const leaderMonster = await Monster.query()
          .where('unit_master_id', defense.leader_monster)
          .select('unit_master_id', 'image')
          .firstOrFail()
        const secondMonster = await Monster.query()
          .where('unit_master_id', defense.second_monster)
          .select('unit_master_id', 'image')
          .firstOrFail()
        const thirdMonster = await Monster.query()
          .where('unit_master_id', defense.third_monster)
          .select('unit_master_id', 'image')
          .firstOrFail()
        const member = await Member.query()
          .where('id', defense.member_id)
          .select('id', 'pseudo')
          .firstOrFail()

        defensesData.push({
          id: defense.id,
          leader: leaderMonster,
          second: secondMonster,
          third: thirdMonster,
          member: member
        })
      }

      compositionsData.push({
        id: composition.id,
        name: composition.name,
        grade: composition.grade,
        defenses: defensesData
      })
    }

    return response.ok(compositionsData)
  }
}
