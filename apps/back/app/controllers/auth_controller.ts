import type { HttpContext} from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import {
  registerValidator,
  createUserMemberValidator,
  createGuildValidator,
} from "#validators/register";
import { loginValidator } from "#validators/login";
import db from '@adonisjs/lucid/services/db'
import fs from 'fs'
import User from "#models/user";
import Member from "#models/member";
import Guild from "#models/guild";

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    if(request.params().step === "1") {
      // Verify user and member and create user
      const payload = await request.validateUsing(createUserMemberValidator)
      const user: any = await db
        .from('users')
        .where('email', payload.email)
        .first()

      async function deletePreviousData(user: any) {
        // Delete previous data if user exists but not completed registration
        const userImage: any = await db
          .from('users')
          .where('email', payload.email)
          .select('image')
          .first()

        if(
          userImage &&
          userImage.image
        ) {
          const imageLink: string = `./uploads/${userImage.image}`

          fs.unlinkSync(imageLink)
        }

        const member: any = await db
          .from('members')
          .where('user_id', user.id)
          .first()

        if(member) {
          await db
            .from('members')
            .where('user_id', user.id)
            .delete()
        }

        const guild: any = await db
          .from('guilds')
          .where('leader_id', user.id)
          .first()
        let members: any = null;

        if(guild) {
          await db
            .from('guilds')
            .where('leader_id', user.id)
            .delete()

          members = await db
            .from('members')
            .where('guild_id', guild.id)
            .select('id')
            .first()
        }

        if(members) {
          await db
            .from('members')
            .where('guild_id', guild.id)
            .delete()
        }

        await db
          .from('users')
          .where('email', payload.email)
          .delete()
      }

      // Check if user exists
      if(
        user &&
        user.pending === 0
      ) {
        // User exists and already registered
        return response.status(400).send({ message: 'Un compte existe déjà avec cette adresse email' })
      } else if(
        user &&
        user.pending === 1
      ) {
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
        role: 'leader',
        image: userImage?.fileName,
      })
        .catch((error) => {
          throw error
        });

      return response.created({ message: 'User created' })
    } else if(request.params().step === "2") {
      // Verify guild and create guild and member
      const payload = await request.validateUsing(createGuildValidator)
      const user: any = await db
        .from('users')
        .where('email', request.input('email'))
        .select('id')
        .first()
      if(!user) {
        return response.status(404).send({ message: 'User not found, back to step 1' })
      }

      const userImage: any = await db
        .from('users')
        .where('email', request.input('email'))
        .select('image')
        .first()
      let guild: any = null
      guild = await Guild.create({
        name: payload.guild_name,
        leader_id: user.id,
        image: userImage.image,
      })
        .catch((error) => {
          throw error
        })

      await Member.create({
        pseudo: request.input('pseudo'),
        grade: 'leader',
        user_id: user.id,
        guild_id: guild.id,
      })
        .catch((error) => {
          throw error
        })

      if(payload.json) {
        const json: any = payload.json;
        await json.move(app.makePath('uploads/json'), {
          name: `${cuid()}.${json.extname}`,
        })
        const jsonLink: string = `./uploads/json/${json.fileName}`

        const data = fs.readFileSync(jsonLink, 'utf8')

        if (!data) {
          fs.unlinkSync(jsonLink)
          return response.status(500).send({ message: 'Error reading json file' })
        }

        async function createMembers(members: any) {
          for (const memberIndex of Object.keys(members)) {
            const member: any = members[memberIndex];

            if(member.grade !== 1) {
              let grade: any;
              const pseudo: string = member.wizard_name;

              if(member.grade === 2) {
                grade = 'member'
              } else if(member.grade === 3) {
                grade = 'vice-leader'
              } else if(member.grade === 4) {
                grade = 'senior'
              }

              await Member.create({
                pseudo: pseudo,
                grade: grade,
                guild_id: guild.id,
              })
            }
          }
        }

        const jsonParsed: any = JSON.parse(data)
        const members: any = jsonParsed.guild.guild_members

        await createMembers(members)

        const membersNumber = Object.keys(members).length

        fs.unlinkSync(jsonLink)

        return response.created({
          message: 'Guild, member and guild mates created',
          leader: request.input('pseudo'),
          members: membersNumber,
        })
      } else {
        return response.created({
          message: 'Guild and member created',
          leader: request.input('pseudo'),
        })
      }
    } else if(request.params().step === "3") {
      const user: any = await db
        .from('users')
        .where('email', request.input('email'))
        .first()
      const guild: any = await db
        .from('guilds')
        .where('name', request.input('guild_name'))
        .first()
      const member: any = await db
        .from('members')
        .where('pseudo', request.input('pseudo'))
        .first()

      if(
        !user &&
        !guild &&
        !member
      ) {
        return response.status(404).send({message: 'User, guild and member not found, go to register page to start registration'})
      } else if(
        !guild ||
        !member
      ) {
        let modelsNotFound = "";

        if(!guild && !member) {
          modelsNotFound = "Guild and Member"
        } else if(!guild) {
          modelsNotFound = "Guild"
        } else {
          modelsNotFound = "Member"
        }

        return response.status(404).send({ message: `${modelsNotFound} not found, back to step 2` })
      } else if(!user) {
        return response.status(404).send({ message: 'User not found, back to step 1' })
      }

      // Verify all information
      await request.validateUsing(registerValidator)
        .catch(async (error) => {
          throw error
        });

      await db
        .from('users')
        .where('email', request.input('email'))
        .update({ pending: 0 })

      return response.created({ message: 'Registration successful' })
    } else {
      return response.status(400).send({ message: 'Invalid step' })
    }
  }

  public async login({ request, response }: HttpContext) {
    const {email, password} = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      const member: any = await db
        .from('members')
        .where('user_id', user.id)
        .select('pseudo', 'grade')
        .first()
      const guild: any = await db
        .from('guilds')
        .where('leader_id', user.id)
        .select('id')
        .first()
      const token = await User.accessTokens.create(user)

      return response.status(200).send({
        "user": {
          "id": user.id,
          "email": user.email,
          "pseudo": member.pseudo,
          "grade": member.grade,
          "image": user.image,
          "guild_id": guild.id,
        },
        token
      })
    } catch (error) {
      return response.status(400).send({ message: 'Email ou mot de passe incorrect' })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const token = user.currentAccessToken
    await User.accessTokens.delete(user, token.identifier)

    return response.status(200).send({ message: 'User logged out' })
  }
}
