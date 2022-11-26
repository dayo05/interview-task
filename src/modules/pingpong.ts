import { applicationCommand, Extension } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, Message } from "discord.js"

class PingPongExtension extends Extension {
  @applicationCommand({
    name: "핑",
    type: ApplicationCommandType.ChatInput,
    description: "핑퐁핑퐁핑퐁"
  })
  async ping(i: ChatInputCommandInteraction) {
    await i.reply(`퐁! 탁구공이 ${i.client.ws.ping}*10^-3초만에 도착했어요!`)
  }
}

export const setup = async () => {
  return new PingPongExtension()
}
