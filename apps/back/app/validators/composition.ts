import vine, {SimpleMessagesProvider} from '@vinejs/vine'

const messages = {
  string: 'Le {{ field }} doit être une chaîne de caractères',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const createCompositionValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    grade: vine.number(),
    defenses: vine.array(
      vine.object({
        member: vine.number(),
        leader: vine.number(),
        second: vine.number(),
        third: vine.number()
      })
    )
  })
)
