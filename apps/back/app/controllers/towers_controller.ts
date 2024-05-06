import type { HttpContext } from '@adonisjs/core/http'
import Member from "#models/member";
import Tower from "#models/tower";
import Defense from "#models/defense";
import Monster from "#models/monster";

export default class TowersController {
  async list({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const member = await Member.query().where('user_id', user.id).select('guild_id').firstOrFail()
    const towers = await Tower
      .query()
      .where('guild_id', member.guild_id)
      .where('side', 'blue')
      .andWhere('map', 'classic')
      .orderBy('position', 'asc')
      .select('id', 'position')
    const defenses = await Defense.query()
      .where('tower_id', 'in', towers.map(tower => tower.id))
      .select('id', 'leader_monster', 'second_monster', 'third_monster', 'member_id', 'tower_id')
    let defensesData: any = {}

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

      const key = `${leaderMonster.unit_master_id}-${secondMonster.unit_master_id}-${thirdMonster.unit_master_id}`

      if (
        defensesData[key] &&
        !defensesData[key].members.includes(member.pseudo)
      ) {
        defensesData[key].members += ` / ${member.pseudo}`;
      } else if (
        defensesData[key] &&
        defensesData[key].members.includes(member.pseudo) &&
        !defensesData[key].members.match(`${member.pseudo} x`)
      ) {
        const numberDefensesAssignedToMember = Object.values(defenses).filter(
          defense =>
            defense.member_id === member.id &&
            defense.leader_monster === leaderMonster.unit_master_id &&
            defense.second_monster === secondMonster.unit_master_id &&
            defense.third_monster === thirdMonster.unit_master_id
        ).length
        defensesData[key].members = defensesData[key].members.replace(member.pseudo, `${member.pseudo} x${numberDefensesAssignedToMember}`);
      } else if (!defensesData[key]) {
        defensesData[key] = {
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
          tower_id: defense.tower_id,
          members: member.pseudo,
        }
      }
    }

    let towersData = []
    for (const tower of towers) {
      let towerDefenses = []
      towerDefenses = Object.values(defensesData).filter(defense => defense.tower_id === tower.id);

      towersData.push({
        id: tower.id,
        position: tower.position,
        defenses: towerDefenses,
      })
    }

    return response.json(towersData)
  }
}
