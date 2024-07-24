import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'string': 'Le {{ field }} doit être une chaîne de caractères',
  'email': "L'email n'est pas valide",
  'username.minLength': 'Le pseudo doit avoir au minimum {{ min }} caractères',
  'username.maxLength': 'Le pseudo doit avoir au maximum {{ max }} caractères',
  'password.minLength': 'Le mot de passe doit avoir au minimum {{ min }} caractères',
  'password.maxLength': 'Le mot de passe doit avoir au maximum {{ max }} caractères',
  'password.confirmed': 'Les mots de passe ne correspondent pas',
  'image.size': "L'image doit faire moins de 10 Mo",
  'image.extnames': "L'image doit être au format jpg, jpeg, png ou webp",
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const createUserMemberValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
    image: vine
      .file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
    username: vine.string().trim().minLength(3).maxLength(20),
  })
)

export const createGuildValidator = vine.compile(
  vine.object({
    json: vine.file({
      extnames: ['json'],
    }),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
    image: vine
      .file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
    username: vine.string().trim().minLength(3).maxLength(20),
    json: vine.file({
      extnames: ['json'],
    }),
  })
)
