import {
  applicationCommand, argConverter,
  CommandClient,
  Extension,
  listener,
  ownerOnly
} from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import path from "path"
import { config } from "../config"
import { verifyUser } from "../data"

class DevModule extends Extension {
  @ownerOnly
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "validate",
    description: "Check validation"
  })
  async ping(i: ChatInputCommandInteraction) {
    verifyUser(i.user)
    await i.reply("정상작동중!")
  }

  @listener({ event: "ready" })
  async ready() {
    this.logger.info(`Logged in as ${this.client.user!.tag}`)
    await this.commandClient.fetchOwners()
  }
}

export class CustomizedCommandClient extends CommandClient {
  async setup() {
    console.log("등록중이에요!")
    await this.enableApplicationCommandsExtension({ guilds: config.guilds })
    await this.enableTextCommandsExtension({ prefix: "" })

    await this.registry.registerModule(new DevModule())

    await this.registry.loadAllModulesInDirectory(
      path.join(__dirname, "..", "modules")
    )
  }
}
