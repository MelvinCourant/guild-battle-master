import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'email.required': 'Une adresse email est requis',
  'email.email': "L'adresse email doit être valide",
  'password.minLength': 'Le mot de passe doit avoir au minimum {{ min }} caractères',
  'password.maxLength': 'Le mot de passe doit avoir au maximum {{ max }} caractères',
  'password.confirmed': 'Les mots de passe ne correspondent pas',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim().minLength(64).maxLength(64),
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
  })
)
