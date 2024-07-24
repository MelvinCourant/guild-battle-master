import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'json.extnames': 'Le fichier doit être un fichier JSON',
  'image.size': "L'image doit faire moins de 10 Mo",
  'image.extnames': "L'image doit être au format jpg, jpeg, png ou webp",
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const fileValidator = vine.compile(
  vine.object({
    json: vine.file({
      extnames: ['json'],
    }),
  })
)

export const imgValidator = vine.compile(
  vine.object({
    image: vine.file({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
  })
)
