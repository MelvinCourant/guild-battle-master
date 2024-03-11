import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

// TODO: Update messages to fr
const messages = {
  string: 'The {{ field }} field must be a string',
  email: 'The {{ field }} field must be a valid email address',
  minLength: 'Le champ {{ field }} doit avoir au minimum {{ min }} caractères',
  maxLength: 'The {{ field }} field must not be greater than {{ max }} characters',
  confirmed: 'The {{ field }} field and {{ otherField }} field must be the same',
  jwt: 'The {{ field }} field must be a valid JWT token',
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

export const createRegisterValidator = vine.compile(
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
