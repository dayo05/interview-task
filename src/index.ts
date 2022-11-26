import { Client } from "discord.js"
import path from "path"
import { config } from "./config"
import { CustomizedCommandClient } from "./structures"

const client = new Client({
  intents: ["Guilds", "DirectMessages"],
})

const cts = new CustomizedCommandClient(client)

const start = async () => {
  await cts.setup()

  await client.login(config.token)

  await cts.getApplicationCommandsExtension()!.sync()
}

start().then()
