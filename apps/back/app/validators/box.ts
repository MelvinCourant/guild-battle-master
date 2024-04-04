import vine, {SimpleMessagesProvider} from '@vinejs/vine'

const messages = {
  'json.extnames': 'Le fichier doit être un fichier JSON',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const fileValidator = vine.compile(
  vine.object({
    json: vine.file({
      extnames: ['json']
    }),
  })
)
