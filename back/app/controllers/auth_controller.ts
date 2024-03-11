import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import {
  createRegisterValidator,
  createUserMemberValidator,
  createGuildValidator,
} from "#validators/register";
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
          // TODO: find a way to delete image if user creation fails
          // userImage?.delete()
          throw error
        });

      return response.status(201).created({ message: 'User created' })
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

      const userImage: any = request.file('user.image')
      let guild: any = null
      guild = await Guild.create({
        name: payload.guild_name,
        leader_id: user.id,
        image: userImage?.fileName,
      })
        .catch((error) => {
          user.delete()
          // TODO: find a way to delete image if user creation fails
          // userImage?.delete()
          throw error
        })

      await Member.create({
        pseudo: request.input('pseudo'),
        user_id: user.id,
        guild_id: guild.id,
      })
        .catch((error) => {
          user.delete()
          // TODO: find a way to delete image if user creation fails
          // userImage?.delete()
          guild.delete()
          throw error
        })

      if(payload.json) {
        const json: any = payload.json;
        await json.move(app.makePath('uploads/json'), {
          name: `${cuid()}.${json.extname}`,
        })

        let membersNumber: number = 1;

        fs.readFile(`./uploads/json/${json.fileName}`, 'utf8', async (error, data) => {
          if (error) {
            // TODO: find a way to delete json
            // json.delete()
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

            membersNumber = Object.keys(members).length
          }

          const jsonParsed: any = JSON.parse(data)
          const members: any = jsonParsed.guild.guild_members

          await createMembers(members)
        })

        // TODO: find a way to delete json file
        // jsonFile.delete()
        return response.status(201).created({
          message: 'Guild, member and guild mates created',
          leader: user.pseudo,
          members: membersNumber,
        })
      } else {
        return response.status(201).created({ message: 'Guild and member created' })
      }
    } else if(request.params().step === "3") {
      const user: any = await db
        .from('users')
        .where('email', request.input('email'))
        .first()
      const userImage: any = request.file('image')
      const guild: any = await db
        .from('guilds')
        .where('name', request.input('guild_name'))
        .first()
      const member: any = await db
        .from('members')
        .where('pseudo', request.input('pseudo'))
        .first()
      const members: any = await db
        .from('members')
        .where('guild_id', guild.id)

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
      await request.validateUsing(createRegisterValidator)
        .catch(async (error) => {
          user.delete()
          // TODO: find a way to delete image if user creation fails
          // userImage?.delete()
          guild.delete()
          member.delete()
          members.forEach((member: any) => {
            member.delete()
          })

          throw error
        });

      return response.status(201).created({ message: 'Registration successful' })
    } else {
      return response.status(400).send({ message: 'Invalid step' })
    }
  }

  public async login() {

  }
}
