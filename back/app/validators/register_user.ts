import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    pseudo: vine.string().trim().minLength(3).maxLength(20),
    password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
    image: vine.string().trim().optional(),
  })
)
