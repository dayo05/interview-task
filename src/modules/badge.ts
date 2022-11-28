import { applicationCommand, Extension, option } from "@pikokr/command.ts"
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  ActionRowBuilder, SelectMenuBuilder, APISelectMenuOption
} from "discord.js"
import { getDataOfUserId, updateUserDataId } from "../data"

class BadgeExtension extends Extension {
  @applicationCommand({
    name: "배지",
    type: ApplicationCommandType.ChatInput,
    description: "유저가 갖고있는 배지들이에요!"
  })
  async badge(i: ChatInputCommandInteraction, @option({
    name: "name",
    description: "보여줄 유저를 알려주세요! (아무것도 없으면 당신이 기본값이에요!)",
    type: ApplicationCommandOptionType.User
  }) user: string) {
    if(user === undefined)
      user = i.user.id //Default value
    await getDataOfUserId(user, async (id, data) => {
      data.badges.push({badgeId: Math.random()})
      await updateUserDataId(user, data)

      const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('badge_list')
            .setPlaceholder('badges')
            .addOptions(data.badges.slice(0, 25).map<APISelectMenuOption>(v => {
              return {
                label: `id: ${v.badgeId}`,
                description: "Custom badge",
                value: `${v.badgeId}`
              }
            }))
        )
      await i.reply({content: "test", components: [row]})
    }, async _ => {
      await i.reply("먼저 등록을 해주세요!")
    }).catch(e => console.log(e))
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
