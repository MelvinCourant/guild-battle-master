import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import {
  registerValidator,
  createUserMemberValidator,
  createGuildValidator,
} from '#validators/register'
import { loginValidator } from '#validators/login'
import fs from 'node:fs'
import User from '#models/user'
import Member from '#models/member'
import Guild from '#models/guild'
import Box from '#models/box'
import Monster from '#models/monster'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    if (request.params().step === '1') {
      // Verify user and member and create user
      const payload = await request.validateUsing(createUserMemberValidator)
      const user: any = await User.query().where('email', payload.email).first()

      async function deletePreviousData(user: any) {
        // Delete previous data if user exists but not completed registration
        const userImage: any = await User.query()
          .where('email', payload.email)
          .select('image')
          .first()

        if (userImage && userImage.image) {
          const imageLink: string = `./uploads/${userImage.image}`

          fs.unlinkSync(imageLink)
        }

        const member: any = await Member.query().where('user_id', user.id).first()

        if (member) {
          await Box.query().where('member_id', member.id).delete()

          await Member.query().where('user_id', user.id).delete()
        }

        const guild: any = await Guild.query().where('leader_id', user.id).first()
        let members: any = null

        if (guild) {
          await Guild.query().where('leader_id', user.id).delete()

          members = await Member.query().where('guild_id', guild.id).select('id').first()
        }

        if (members) {
          await Member.query().where('guild_id', guild.id).delete()
        }

        await User.query().where('email', payload.email).delete()
      }

      // Check if user exists
      if (user && user.pending === 0) {
        // User exists and already registered
        return response
          .status(400)
          .send({ message: 'Un compte existe déjà avec cette adresse email' })
      } else if (user && user.pending === 1) {
        // User exists but not completed registration
        await deletePreviousData(user)
      }

      const userImage: any = payload.image
      await userImage?.move(app.makePath('uploads'), {
        name: `${cuid()}.${userImage.extname}`,
      })

      await User.create({
        email: payload.email,
        password: payload.password,
        username: payload.username,
        role: 'moderator',
        image: userImage?.fileName,
      }).catch((error) => {
        throw error
      })

      return response.created({ message: 'User created' })
    } else if (request.params().step === '2') {
      // Verify guild and create guild and member
      const payload = await request.validateUsing(createGuildValidator)
      const user: any = await User.query()
        .where('email', request.input('email'))
        .select('id')
        .first()
      if (!user) {
        return response.status(404).send({ message: 'User not found, back to step 1' })
      }

      const userImage: any = await User.query()
        .where('email', request.input('email'))
        .select('image')
        .first()

      const json: any = payload.json
      await json.move(app.makePath('uploads/json'), {
        name: `${cuid()}.${json.extname}`,
      })
      const jsonLink: string = `./uploads/json/${json.fileName}`

      const data = fs.readFileSync(jsonLink, 'utf8')

      if (!data) {
        fs.unlinkSync(jsonLink)
        return response.status(500).send({ message: 'Error reading json file' })
      }

      async function createMembers(wizardId: number, members: any) {
        for (const memberIndex of Object.keys(members)) {
          const member: any = members[memberIndex]
          let grade: any
          const pseudo: string = member.wizard_name

          if (member.grade === 1) {
            grade = 'leader'

            if (member.wizard_id === wizardId) {
              user.role = 'leader'
              await user.save()
            } else {
              leaderPseudo = member.wizard_name
            }
          } else if (member.grade === 2) {
            grade = 'member'
          } else if (member.grade === 3) {
            grade = 'vice-leader'
          } else if (member.grade === 4) {
            grade = 'senior'
          }

          if (member.wizard_id === wizardId) {
            const memberRegistered = await Member.create({
              wizard_id: member.wizard_id,
              pseudo: pseudo,
              grade: grade,
              guild_id: guild.id,
              user_id: user.id,
            })

            memberId = memberRegistered.id
            const monsters: any = jsonParsed.unit_list
            await createBoxes(memberId, monsters)
          } else {
            await Member.create({
              wizard_id: member.wizard_id,
              pseudo: pseudo,
              grade: grade,
              guild_id: guild.id,
            })
          }
        }
      }

      async function createBoxes(memberId: number, monsters: any) {
        for (const monster of monsters) {
          const box: any = await Box.query()
            .where('monster_id', monster.unit_master_id)
            .andWhere('member_id', memberId)
            .first()
          const monsterExists: any = await Monster.query()
            .where('unit_master_id', monster.unit_master_id)
            .first()
          const numberOfMonsters = monsters.filter(
            (m: any) => m.unit_master_id === monster.unit_master_id
          ).length

          if (!monsterExists) {
            continue
          }

          if (
            box &&
            box.quantity !== numberOfMonsters
          ) {
            box.quantity = numberOfMonsters
            await box.save()
          } else {
            await Box.create({
              monster_id: monster.unit_master_id,
              member_id: memberId,
              quantity: numberOfMonsters,
              monsters_assigned: 0,
            })
          }
        }
      }

      const jsonParsed: any = JSON.parse(data)
      const wizardId: number = jsonParsed.wizard_info.wizard_id
      let guild: any = null
      const guildName: string = jsonParsed.guild.guild_info.name
      guild = await Guild.create({
        name: guildName,
        leader_id: user.id,
        image: userImage.image,
      }).catch((error) => {
        throw error
      })

      const members: any = jsonParsed.guild.guild_members
      let memberId: number = 0
      let leaderPseudo: string = members[wizardId].wizard_name

      await createMembers(wizardId, members)

      const membersNumber = Object.keys(members).length

      fs.unlinkSync(jsonLink)

      return response.created({
        message: 'Guild, member and guild mates created',
        guildName: guildName,
        leader: leaderPseudo,
        members: membersNumber,
      })
    } else if (request.params().step === '3') {
      const user: any = await User.query().where('email', request.input('email')).first()
      const member: any = await Member.query().where('user_id', user.id).first()
      const guild: any = await Guild.query().where('id', member.guild_id).first()

      if (!user && !guild && !member) {
        return response.status(404).send({
          message: 'User, guild and member not found, go to register page to start registration',
        })
      } else if (!guild || !member) {
        let modelsNotFound = ''

        if (!guild && !member) {
          modelsNotFound = 'Guild and Member'
        } else if (!guild) {
          modelsNotFound = 'Guild'
        } else {
          modelsNotFound = 'Member'
        }

        return response.status(404).send({ message: `${modelsNotFound} not found, back to step 2` })
      } else if (!user) {
        return response.status(404).send({ message: 'User not found, back to step 1' })
      }

      // Verify all information
      await request.validateUsing(registerValidator).catch(async (error) => {
        throw error
      })

      user.pending = 0
      await user.save()

      return response.created({ message: 'Registration successful' })
    } else {
      return response.status(400).send({ message: 'Invalid step' })
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      const member: any = await Member.query()
        .where('user_id', user.id)
        .select('pseudo', 'grade')
        .firstOrFail()
      const token = await User.accessTokens.create(user)

      return response.status(200).send({
        user: {
          pseudo: member.pseudo,
          grade: member.grade,
          image: user.image,
        },
        token,
      })
    } catch (error) {
      return response.status(400).send({ message: 'Email ou mot de passe incorrect' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const token = user.currentAccessToken
    await User.accessTokens.delete(user, token.identifier)

    return response.status(200).send({ message: 'User logged out' })
  }
}
