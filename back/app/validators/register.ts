import vine from '@vinejs/vine'

export const createUserMemberValidator = vine.compile(
  vine.object({
    user: vine.object({
      email: vine.string().trim().email(),
      password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
      image: vine.file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      }).optional()
    }),
    member: vine.object({
      pseudo: vine.string().trim().minLength(3).maxLength(20),
    }),
  })
)

export const createGuildValidator = vine.compile(
  vine.object({
    guild: vine.object({
      name: vine.string().trim().minLength(3).maxLength(20),
      json: vine.file({
        extnames: ['json']
      }).optional(),
    }),
  })
)

export const createRegisterValidator = vine.compile(
  vine.object({
    user: vine.object({
      email: vine.string().trim().email(),
      password: vine.string().trim().minLength(8).maxLength(20).confirmed(),
      image: vine.file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      }).optional()
    }),
    member: vine.object({
      pseudo: vine.string().trim().minLength(3).maxLength(20),
    }),
    guild: vine.object({
      name: vine.string().trim().minLength(3).maxLength(20),
      json: vine.file({
        extnames: ['json']
      }).optional(),
    }),
  })
)
