import {
  applicationCommand,
  CommandClient,
  Extension,
  ownerOnly
} from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import path from "path"
import { config } from "../config"

class DevModule extends Extension {
  @ownerOnly
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "validate",
    description: "Check validation"
  })
  async ping(i: ChatInputCommandInteraction) {
    await i.reply("정상작동중!")
  }
}

export class CustomizedCommandClient extends CommandClient {
  async setup() {
    console.log("등록중이에요!")
    await this.enableApplicationCommandsExtension({ guilds: config.guilds })
    await this.registry.registerModule(new DevModule())

    await this.registry.loadAllModulesInDirectory(
      path.join(__dirname, "..", "modules")
    )
  }
}
