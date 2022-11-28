import { applicationCommand, Extension, option } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, ApplicationCommandOptionType, User } from "discord.js"
import { getDataOfUserId, updateUserDataId } from "../data"

class BadgeExtension extends Extension {
  @applicationCommand({
    name: "배지",
    type: ApplicationCommandType.ChatInput,
    description: "yeah!"
  })
  async ping(i: ChatInputCommandInteraction, @option({
    name: "name",
    description: "asdf",
    type: ApplicationCommandOptionType.User
  }) user: string) {
    await getDataOfUserId(user, async (id, data) => {
      data.badges.push({
        badgeId: 12
      })
      await updateUserDataId(id, data)
    }).catch(e => console.log(e))
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
