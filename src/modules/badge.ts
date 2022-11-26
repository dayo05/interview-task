import { applicationCommand, Extension, option } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, ApplicationCommandOptionType, User } from "discord.js"

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
    type: ApplicationCommandOptionType.User
  }) user: User) {
    if(user === undefined)
      await i.reply(`아무것도 입력되지 않았어요!`)
    else await i.reply(`입력값은 ${user}이에요!`)
  }
  @applicationCommand({
    name: "랭킹",
    type: ApplicationCommandType.ChatInput,
    description: "asdfasdf"
  })
  async rank(i: ChatInputCommandInteraction) {

  }
}

export const setup = async () => {
  return new BadgeExtension()
}
