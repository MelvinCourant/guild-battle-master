import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  string: 'Le {{ field }} doit être une chaîne de caractères',
  email: 'L\'email n\'est pas valide',
  'pseudo.minLength': 'Le pseudo doit avoir au minimum {{ min }} caractères',
  'pseudo.maxLength': 'Le pseudo doit avoir au maximum {{ max }} caractères',
  'password.minLength': 'Le mot de passe doit avoir au minimum {{ min }} caractères',
  'password.maxLength': 'Le mot de passe doit avoir au maximum {{ max }} caractères',
  'password.confirmed': 'Les mots de passe ne correspondent pas',
  'guild_name.minLength': 'Le nom de la guilde doit avoir au minimum {{ min }} caractères',
  'guild_name.maxLength': 'Le nom de la guilde doit avoir au maximum {{ max }} caractères',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const createUserMemberValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
    image: vine.file({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp']
    }).optional(),
    pseudo: vine.string().trim().minLength(3).maxLength(20),
  })
)

export const createGuildValidator = vine.compile(
  vine.object({
    guild_name: vine.string().trim().minLength(3).maxLength(20),
    json: vine.file({
      extnames: ['json']
    }).optional(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
    image: vine.file({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp']
    }).optional(),
    pseudo: vine.string().trim().minLength(3).maxLength(20),
    guild_name: vine.string().trim().minLength(3).maxLength(20),
    json: vine.file({
      extnames: ['json']
    }).optional(),
  })
)
