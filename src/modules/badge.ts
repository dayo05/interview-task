import { applicationCommand, Extension, listener, option } from "@pikokr/command.ts"
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  SelectMenuBuilder,
  APISelectMenuOption,
  Events,
  SelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle, ButtonComponent, ActionRow
} from "discord.js"
import { getDataOfUser, getDataOfUserId, IUser, updateUserDataId } from "../data"

class BadgeExtension extends Extension {
  constructor() {
    super()
  }
  @listener({ event: Events.InteractionCreate })
  async onSelection(interaction: SelectMenuInteraction) {
    if(interaction.customId === 'badge_list') {
      await interaction.deferUpdate()
      await interaction.editReply({content: `배지 번호 ${interaction.values[0]}를 선택했습니다!`})
    }
  }

  @listener({event: Events.InteractionCreate})
  async onButtonClick(interaction: ButtonInteraction) {
    if(interaction.customId === 'badge_list_back') {
      await interaction.deferUpdate()
      await getDataOfUser(interaction.user, async (user, data) => {
        await interaction.editReply({content: "back!", components: this.getBadgeComponents(data, Number((interaction.message.components[1] as ActionRow<ButtonComponent>).components[1].label?.split("/")[0]) - 2)})
      })
    }
    else if(interaction.customId === 'badge_list_forward') {
      await interaction.deferUpdate()
      await getDataOfUser(interaction.user, async (user, data) => {
        await interaction.editReply({content: "back!", components: this.getBadgeComponents(data, Number((interaction.message.components[1] as ActionRow<ButtonComponent>).components[1].label?.split("/")[0]))})
      })
    }
  }

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
      data.badges.push({badgeId: Math.floor((Math.random() * 100000000))})
      await updateUserDataId(user, data)
      
      await i.reply({content: "test", components: this.getBadgeComponents(data, 0)})
    }, async _ => {
      await i.reply("먼저 등록을 해주세요!")
    }).catch(e => console.log(e))
  }
  
  getBadgeComponents(data: IUser, index: number): any {
    const limit = 25
    const row = new ActionRowBuilder<SelectMenuBuilder>()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('badge_list')
          .setPlaceholder('badges')
          .addOptions(data.badges.slice(index * limit, (index + 1) * limit).map<APISelectMenuOption>(v => {
            return {
              label: `id: ${v.badgeId}`,
              description: "Custom badge",
              value: `${v.badgeId}`
            }
          }))
      )
    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('badge_list_back')
          .setLabel('뒤로!')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(index === 0)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('badge_list_index')
          .setLabel(`${index + 1}/${Math.floor((data.badges.length + limit - 1) / limit)}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('badge_list_forward')
          .setLabel('다음꺼!')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(index === Math.floor((data.badges.length - 1) / limit))
      )
    return [row, buttons]
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
