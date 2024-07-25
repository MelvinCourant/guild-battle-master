import type { HttpContext } from '@adonisjs/core/http'
import { createCompositionValidator } from '#validators/composition'
import Member from '#models/member'
import Guild from '#models/guild'
import Composition from '#models/composition'
import Defense from '#models/defense'
import Monster from '#models/monster'
import Box from '#models/box'

export default class CompositionsController {
  async create({ i18n, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(createCompositionValidator)

    if (user.role !== 'admin' && user.role !== 'leader' && user.role !== 'moderator') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const member = await Member.query().where('user_id', user.id).firstOrFail()
    const guild = await Guild.query().where('id', member.guild_id).firstOrFail()

    // @ts-ignore
    const composition = await Composition.create({
      name: payload.name,
      grade: payload.grade.toString(),
      guild_id: guild.id,
    })

    for (const defense of payload.defenses) {
      const memberAssigned = await Member.query().where('id', defense.member).firstOrFail()
      const defenseAssigned = await Defense.create({
        composition_id: composition.id,
        member_id: defense.member,
        leader_monster: defense.leader,
        second_monster: defense.second,
        third_monster: defense.third,
      })
      const boxMemberAssigned = await Box.query()
        .where('member_id', memberAssigned.id)
        .andWhere((builder) => {
          builder
            .where('monster_id', defenseAssigned.leader_monster)
            .orWhere('monster_id', defenseAssigned.second_monster)
            .orWhere('monster_id', defenseAssigned.third_monster)
        })

      if (boxMemberAssigned.length === 0) {
        return response
          .status(404)
          .send({ message: i18n.t('messages.one_of_member_does_not_save_monster_listed') })
      }

      boxMemberAssigned.forEach((box) => {
        box.monsters_assigned++
        box.save()
      })
    }

    return response.created({ message: i18n.t('messages.composition_successfully_created') })
  }

  async destroy({ i18n, auth, params, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin' && user.role !== 'leader' && user.role !== 'moderator') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const composition = await Composition.query().where('id', params.id).firstOrFail()
    const defenses = await Defense.query()
      .where('composition_id', composition.id)
      .select('id', 'leader_monster', 'second_monster', 'third_monster', 'member_id')
    const monstersAssigned = await Box.query()
      .where(
        'member_id',
        'in',
        defenses.map((defense) => defense.member_id)
      )
      .andWhere((builder) => {
        builder
          .where(
            'monster_id',
            'in',
            defenses.map((defense) => defense.leader_monster)
          )
          .orWhere(
            'monster_id',
            'in',
            defenses.map((defense) => defense.second_monster)
          )
          .orWhere(
            'monster_id',
            'in',
            defenses.map((defense) => defense.third_monster)
          )
      })

    defenses.forEach((defense) => {
      monstersAssigned.forEach((monsterAssigned) => {
        monsterAssigned.monsters_assigned--
        monsterAssigned.save()
      })

      defense.delete()
    })

    await composition.delete()

    return response.noContent()
  }

  async search({ i18n, auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const guildId = params.guildId
    const guild = await Guild.query().where('id', guildId).first()
    const userMember = await Member.query().where('user_id', user.id).firstOrFail()
    const userGuild = await Guild.query().where('id', userMember.guild_id).firstOrFail()

    if (!guild || userGuild.id !== guild.id) {
      return response.status(404).send({ message: i18n.t('messages.guild_invalid_not_exist') })
    }

    const keyword = request.input('keyword')
    const filters = request.input('filters')
    let query = Composition.query().where('guild_id', guild.id)

    if (keyword) {
      query = query.andWhere('name', 'like', `%${keyword}%`)
    }

    if (filters) {
      for (const filter in filters) {
        if (filter === '4_stars' || filter === '5_stars') {
          const stars = filter.split('_')[0]
          query = query.andWhereNot('grade', stars)
        }
      }
    }

    const compositions = await query.select('id', 'name', 'grade').orderBy('grade', 'desc')
    let compositionsData = []

    for (const composition of compositions) {
      const defenses = await Defense.query()
        .where('composition_id', composition.id)
        .select('id', 'leader_monster', 'second_monster', 'third_monster', 'member_id', 'tower_id')
      let defensesData = []

      if (defenses.length === 0) {
        compositionsData.push({
          id: composition.id,
          name: composition.name,
          grade: composition.grade,
          defenses: [],
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

        let defenseInfo = {}

        if (
          request.input('tower_id') !== null &&
          defense.tower_id &&
          defense.tower_id == request.input('tower_id')
        ) {
          defenseInfo = {
            id: defense.id,
            leader: leaderMonster,
            second: secondMonster,
            third: thirdMonster,
            member: member,
            is_selected: true,
          }
        } else if (
          request.input('tower_id') &&
          defense.tower_id &&
          defense.tower_id != request.input('tower_id')
        ) {
          continue
        } else {
          defenseInfo = {
            id: defense.id,
            leader: leaderMonster,
            second: secondMonster,
            third: thirdMonster,
            member: member,
          }
        }

        defensesData.push(defenseInfo)
      }

      if (defensesData.length === 0) {
        continue
      }

      compositionsData.push({
        id: composition.id,
        name: composition.name,
        grade: composition.grade,
        defenses: defensesData,
      })
    }

    return response.ok(compositionsData)
  }

  async update({ i18n, auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await request.validateUsing(createCompositionValidator)
    const composition = await Composition.query().where('id', params.id).firstOrFail()
    const member = await Member.query().where('user_id', user.id).firstOrFail()
    const guild = await Guild.query().where('id', member.guild_id).firstOrFail()

    if (
      user.role !== 'admin' &&
      user.role !== 'leader' &&
      user.role !== 'moderator' &&
      guild.id !== composition.guild_id
    ) {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    if (payload.name !== composition.name) {
      composition.name = payload.name
    }

    const grade = payload.grade.toString()

    if (grade !== composition.grade) {
      // @ts-ignore
      composition.grade = grade
    }

    await composition.save()

    const actualDefenses = await Defense.query()
      .where('composition_id', composition.id)
      .select('id', 'leader_monster', 'second_monster', 'third_monster', 'member_id')
    let defensesData = payload.defenses

    for (const actualDefense of actualDefenses) {
      const boxMemberAssigned = await Box.query()
        .where('member_id', actualDefense.member_id)
        .andWhere((builder) => {
          builder
            .where('monster_id', actualDefense.leader_monster)
            .orWhere('monster_id', actualDefense.second_monster)
            .orWhere('monster_id', actualDefense.third_monster)
        })
      const defensesAssignedInPayload = payload.defenses.filter(
        (defense) =>
          defense.member === actualDefense.member_id &&
          defense.leader === actualDefense.leader_monster &&
          defense.second === actualDefense.second_monster &&
          defense.third === actualDefense.third_monster
      )

      if (boxMemberAssigned.length === 0) {
        return response
          .status(404)
          .send({ message: i18n.t('messages.one_of_member_does_not_save_monster_listed') })
      }

      if (
        defensesAssignedInPayload &&
        boxMemberAssigned.length === defensesAssignedInPayload.length
      ) {
        defensesData = defensesData.filter(
          (defense) =>
            defense.member !== actualDefense.member_id &&
            defense.leader !== actualDefense.leader_monster &&
            defense.second !== actualDefense.second_monster &&
            defense.third !== actualDefense.third_monster
        )
      } else if (
        boxMemberAssigned.length !== 0 &&
        defensesAssignedInPayload &&
        boxMemberAssigned.length !== defensesAssignedInPayload.length
      ) {
        boxMemberAssigned.forEach((box) => {
          box.monsters_assigned--
          box.save()
        })

        await actualDefense.delete()
      }
    }

    for (const defense of defensesData) {
      const memberAssigned = await Member.query().where('id', defense.member).firstOrFail()
      const defenseAssigned = await Defense.create({
        composition_id: composition.id,
        member_id: defense.member,
        leader_monster: defense.leader,
        second_monster: defense.second,
        third_monster: defense.third,
      })
      const boxMemberAssigned = await Box.query()
        .where('member_id', memberAssigned.id)
        .andWhere((builder) => {
          builder
            .where('monster_id', defenseAssigned.leader_monster)
            .orWhere('monster_id', defenseAssigned.second_monster)
            .orWhere('monster_id', defenseAssigned.third_monster)
        })

      if (boxMemberAssigned.length === 0) {
        return response
          .status(404)
          .send({ message: i18n.t('messages.one_of_member_does_not_save_monster_listed') })
      }

      boxMemberAssigned.forEach((box) => {
        box.monsters_assigned++
        box.save()
      })
    }

    return response.created({ message: i18n.t('messages.composition_successfully_updated') })
  }

  async show({ i18n, auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const userMember = await Member.query()
      .where('user_id', user.id)
      .select('guild_id')
      .firstOrFail()
    const composition = await Composition.query()
      .where('id', params.id)
      .select('id', 'name', 'grade', 'guild_id')
      .firstOrFail()

    if (composition.guild_id !== userMember.guild_id) {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const defenses = await Defense.query()
      .where('composition_id', composition.id)
      .select('id', 'leader_monster', 'second_monster', 'third_monster', 'member_id', 'tower_id')
    let defensesData = []

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
        leader: {
          unit_master_id: leaderMonster.unit_master_id,
          image: leaderMonster.image,
        },
        second: {
          unit_master_id: secondMonster.unit_master_id,
          image: secondMonster.image,
        },
        third: {
          unit_master_id: thirdMonster.unit_master_id,
          image: thirdMonster.image,
        },
        member: member,
      })
    }

    return response.ok({
      name: composition.name,
      grade: composition.grade,
      defenses: defensesData,
    })
  }
}
