import { Client } from "discord.js"
import path from "path"
import { config } from "./config"
import { CustomizedCommandClient } from "./structures"
import { initDB } from "./data"

const client = new Client({
  intents: ["Guilds", "DirectMessages", "GuildMessages", "MessageContent"]
})

const cts = new CustomizedCommandClient(client)

const start = async () => {
  await initDB()

  await cts.setup()

  await client.login(config.token)

  await cts.getApplicationCommandsExtension()!.sync()
}

start().then()
