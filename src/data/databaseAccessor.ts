import { User } from "discord.js"
import * as mongoose from "mongoose"

interface IUser {
  id: string
  username: string
  likability: number
  battery: number
  badges: mongoose.Types.ObjectId[] | IBadge[]
  verifiedAt?: Date
}

interface IBadge {
  badgeId: number
  owner: mongoose.Types.ObjectId | IUser
}

let userDataMap = new Map<string, IUser>()

export async function getDataOfUser(user: User, existThen: (user: User, data: IUser) => void, notVerifiedThen: (user: User) => void = (_ => {})) {
  const x = userDataMap.get(user.id)
  if(x !== undefined) await existThen(user, x)
  else await notVerifiedThen(user)
}

export async function updateUserData(user: User, data: IUser, notVerifiedThen: (user: User) => void = (_) => {}) {
  if(!userDataMap.has(user.id)) await notVerifiedThen(user)
  else userDataMap.set(user.id, data)
}

export function verifyUser(user: User) {
  userDataMap.set(user.id, {
    id: user.id,
    username: user.username,
    likability: 0,
    battery: 100,
    badges: [],
    verifiedAt: new Date()
  })
}

export function getLikeLevel(data: IUser): number {
  return 0
}