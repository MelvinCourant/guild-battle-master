import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'email.required': 'Une adresse email est requis',
  'email.email': "L'adresse email doit être valide",
  'password.required': 'Un mot de passe est requis',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)
