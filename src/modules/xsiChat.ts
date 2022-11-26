import { command, Extension } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, Message } from "discord.js"

interface XsiInteraction {
  readonly input: string | Promise<Message>
  readonly reply: string | Promise<Message>,
  readonly bias: number
}

class XsiChatExtension extends Extension {
  interactionMap = new Set<XsiInteraction>()
  constructor() {
    super()
    this.interactionMap.add({
      input: "안녕",
      reply: "안녕하세요!",
      bias: 1
    })
  }
  @command({ name: "크시야" })
  async chatMainHandler(message: Message) {
    const text = message.content.substring(4)
    this.logger.info(`Received ${text}`)
    await message.reply("?")
  }
}

export const setup = async () => {
  return new XsiChatExtension()
}
