import { command, Extension } from "@ddayo/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, Message } from "discord.js"
import { randomInt } from "crypto"
import { getDataOfUser, updateUserData } from "../data"

interface XsiInteraction {
  readonly input: string | ((message: Message) => Promise<boolean>)
  readonly reply: string | ((message: Message, likeabilityDelta: number) => Promise<void>)
  readonly bias: number
  readonly likabilityDelta: number
}

class XsiChatExtension extends Extension {
  interactionMap = new Set<XsiInteraction>()
  constructor() {
    super()
    this.interactionMap.add({
      input: "안녕",
      reply: "안녕하세요!",
      bias: 1,
      likabilityDelta: 1
    })
    this.interactionMap.add({
      input: "안녕",
      reply: async (message, likeabilityDelta) => {
        await message.reply(`안녕하세요 ${message.author.username}님!`)
      },
      bias: 1,
      likabilityDelta: 1
    })
    this.interactionMap.add({
      input: "좋아해",
      reply: async(message, likeabilityDelta) => {
        await message.reply(`저도 ${message.author.username}님이 좋아요!`)
      },
      bias: 1,
      likabilityDelta: 3
    })
    this.interactionMap.add({
      input: "저리가",
      reply: "…그런 말 하시면 슬퍼요…",
      bias: 1,
      likabilityDelta: -2
    })
    this.interactionMap.add({
      input: async message => /^[\d+\-*\/)(]*$/.exec(message.content.substring(4).replace(" ", "")) != null,
      reply: async (message, _) => {
        //This is safe because we validated message.content.substring(4) always matches /^[\d+\-*\/)(]*$/
        await message.reply(`${eval(message.content.substring(4)).toString()}이에요!`)
      },
      bias: 1,
      likabilityDelta: 0
    })
  }

  @command({ name: "크시야" })
  async chatMainHandler(message: Message) {
    if(message.author.bot) return
    const text = message.content.substring(4)

    let selectableIteration: Array<XsiInteraction> = []
    let totalBias = 0
    for (const iteration of this.interactionMap.values()) {
      if (typeof iteration.input === "string") {
        if (text.includes(<string>iteration.input)) {
          selectableIteration.push(iteration)
          totalBias += iteration.bias
        }
      } else if (await iteration.input(message)) {
        selectableIteration.push(iteration)
        totalBias += iteration.bias
      }
    }

    let collect = randomInt(totalBias)
    for (const collected of selectableIteration) {
      collect -= collected.bias
      if (collect < 0) {
        if (typeof collected.reply === "string")
          await message.reply(<string>collected.reply)
        else await collected.reply(message, collected.likabilityDelta)

        await getDataOfUser(message.author, async(user, data) => {
          data.likability += collected.likabilityDelta
          await updateUserData(user, data)
        })
        break
      }
    }
  }
}

export const setup = async () => {
  return new XsiChatExtension()
}
