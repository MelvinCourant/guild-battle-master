import type { HttpContext } from '@adonisjs/core/http'
import Guild from '#models/guild'
import Member from '#models/member'
import User from '#models/user'

export default class AdminController {
  async listGuilds({ i18n, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const page = request.input('page') || 1
    const pageSize = request.input('pageSize') || 25
    const guilds = await Guild.query()
      .select('id', 'guild_id_json', 'name', 'image', 'leader_id', 'created_at')
      .paginate(page, pageSize)
    guilds.namingStrategy = {
      paginationMetaKeys() {
        return {
          total: 'total',
          perPage: 'per_page',
          currentPage: 'current_page',
          lastPage: 'last_page',
          firstPage: 'first_page',
          firstPageUrl: 'first_page_url',
          lastPageUrl: 'last_page_url',
          nextPageUrl: 'next_page_url',
          previousPageUrl: 'previous_page_url',
        }
      },
    }

    const guildsData = await Promise.all(
      guilds.toJSON().data.map(async (guild) => {
        const leader = await Member.query()
          .where('user_id', guild.leader_id)
          .select('pseudo')
          .firstOrFail()
        return {
          guild: {
            id: guild.id,
            guild_id_json: guild.guild_id_json,
            name: guild.name,
            image: guild.image,
            created_at: guild.createdAt,
          },
          leader: {
            user_id: guild.leader_id,
            pseudo: leader.pseudo,
          },
        }
      })
    )

    return response.json({
      meta: guilds.toJSON().meta,
      data: guildsData,
    })
  }

  async searchGuild({ i18n, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const keyword = request.input('keyword')
    const sort = request.input('sort')
    let query = Guild.query().leftJoin('members', 'guilds.leader_id', 'members.user_id')

    if (keyword) {
      query = query
        .where('guilds.name', 'like', `%${keyword}%`)
        .orWhere('members.pseudo', 'like', `%${keyword}%`)
    }

    query = query.select('guilds.*', 'members.pseudo as leader_pseudo')

    if (sort) {
      if (sort.name === 'pseudo') {
        query = query.orderBy('members.pseudo', sort.order)
      } else {
        query = query.orderBy(sort.name, sort.order)
      }
    }

    const page = request.input('page') || 1
    const pageSize = request.input('pageSize') || 25
    const guilds = await query.paginate(page, pageSize)
    guilds.namingStrategy = {
      paginationMetaKeys() {
        return {
          total: 'total',
          perPage: 'per_page',
          currentPage: 'current_page',
          lastPage: 'last_page',
          firstPage: 'first_page',
          firstPageUrl: 'first_page_url',
          lastPageUrl: 'last_page_url',
          nextPageUrl: 'next_page_url',
          previousPageUrl: 'previous_page_url',
        }
      },
    }

    const guildsData = await Promise.all(
      guilds.toJSON().data.map(async (guild) => {
        const leader = await Member.query()
          .where('user_id', guild.leader_id)
          .select('pseudo')
          .firstOrFail()
        return {
          guild: {
            id: guild.id,
            guild_id_json: guild.guild_id_json,
            name: guild.name,
            image: guild.image,
            created_at: guild.createdAt,
          },
          leader: {
            user_id: guild.leader_id,
            pseudo: leader.pseudo,
          },
        }
      })
    )

    return response.json({
      meta: guilds.toJSON().meta,
      data: guildsData,
    })
  }

  async listUsers({ i18n, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.status(403).json({ message: i18n.t('messages.forbidden') })
    }

    const page = request.input('page') || 1
    const pageSize = request.input('pageSize') || 25
    const users = await User.query().where('role', '!=', 'admin').paginate(page, pageSize)
    users.namingStrategy = {
      paginationMetaKeys() {
        return {
          total: 'total',
          perPage: 'per_page',
          currentPage: 'current_page',
          lastPage: 'last_page',
          firstPage: 'first_page',
          firstPageUrl: 'first_page_url',
          lastPageUrl: 'last_page_url',
          nextPageUrl: 'next_page_url',
          previousPageUrl: 'previous_page_url',
        }
      },
    }

    const usersData = await Promise.all(
      users.toJSON().data.map(async (user) => {
        const member = await Member.query()
          .where('user_id', user.id)
          .select('id', 'pseudo', 'guild_id')
          .first()

        if (!member) {
          return {
            user: {
              id: user.id,
              username: user.username,
              image: user.image,
              created_at: user.createdAt,
            },
            member: null,
          }
        }

        const guild = await Guild.query().where('id', member.guild_id).firstOrFail()

        return {
          user: {
            id: user.id,
            username: user.username,
            image: user.image,
            created_at: user.createdAt,
          },
          member: {
            id: member.id,
            pseudo: member.pseudo,
          },
          guild: {
            id: guild.id,
            name: guild.name,
          },
        }
      })
    )

    return response.json({
      meta: users.toJSON().meta,
      data: usersData,
    })
  }
}
