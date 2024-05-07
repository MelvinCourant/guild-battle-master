import type { HttpContext } from '@adonisjs/core/http'
import Defense from '#models/defense'
import Member from '#models/member'
import Monster from '#models/monster'

export default class DefensesController {
  async list({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const member = await Member.query().where('user_id', user.id).select('guild_id').firstOrFail()
    const members = await Member.query().where('guild_id', member.guild_id).select('id', 'pseudo')
    const defenses = await Defense.query()
      .whereIn(
        'member_id',
        members.map((member) => member.id)
      )
      .select('member_id', 'leader_monster', 'second_monster', 'third_monster')
    let defensesPerMember = []

    for (const member of members) {
      const memberDefenses = defenses.filter((defense) => defense.member_id === member.id)

      if (memberDefenses.length === 0) continue

      let defensesData = []

      for (const memberDefense of memberDefenses) {
        const leaderMonster = await Monster.query()
          .where('unit_master_id', memberDefense.leader_monster)
          .select('unit_master_id', 'name', 'image')
          .firstOrFail()
        const secondMonster = await Monster.query()
          .where('unit_master_id', memberDefense.second_monster)
          .select('unit_master_id', 'name', 'image')
          .firstOrFail()
        const thirdMonster = await Monster.query()
          .where('unit_master_id', memberDefense.third_monster)
          .select('unit_master_id', 'name', 'image')
          .firstOrFail()

        defensesData.push({
          leader: {
            name: leaderMonster.name,
            image: leaderMonster.image,
          },
          second: {
            name: secondMonster.name,
            image: secondMonster.image,
          },
          third: {
            name: thirdMonster.name,
            image: thirdMonster.image,
          },
        })
      }

      defensesData = defensesData.sort((a, b) => {
        if (a.leader.name < b.leader.name) {
          return -1
        }
        if (a.leader.name > b.leader.name) {
          return 1
        }
        return 0
      })

      defensesPerMember.push({
        member: member.pseudo,
        defenses: defensesData,
      })
    }

    return response.ok(defensesPerMember)
  }
}
