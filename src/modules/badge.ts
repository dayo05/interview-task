import { applicationCommand, argConverter, Extension, option } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js"

class BadgeExtension extends Extension {
  constructor() {
    super()
  }
  @applicationCommand({
    name: "배지",
    type: ApplicationCommandType.ChatInput,
    description: "yeah!"
  })
  async ping(i: ChatInputCommandInteraction, @option({
    name: "name",
    description: "asdf",
    type: ApplicationCommandOptionType.String
  }) user: String) {
    await i.reply(`입력값은 ${user}이에요!`)
  }
}

export const setup = async () => {
  return new BadgeExtension()
}
