import { applicationCommand, Extension, listener } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"

class HelloExtension extends Extension {
  @listener({ event: "ready" })
  async ready() {
    this.logger.info(`Logged in as ${this.client.user!.tag}`)
    await this.commandClient.fetchOwners()
  }

  @applicationCommand({
    name: "핑",
    type: ApplicationCommandType.ChatInput,
    description: "핑퐁핑퐁핑퐁",
  })
  async ping(i: ChatInputCommandInteraction) {
    await i.reply(`탁구공이 ${i.client.ws.ping}*10^-3초만에 도착했어요!`)
  }
}

export const setup = async () => {
  return new HelloExtension()
}
