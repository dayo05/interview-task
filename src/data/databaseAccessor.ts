import { User } from "discord.js"
import * as mongoose from "mongoose"
import { model, Model, Schema, Types } from "mongoose"

interface IBadge {
  badgeId: number
}
interface BadgeModel extends IBadge, Types.Subdocument {}
const BadgeSchema = new Schema({
  badgeId: Number
})

interface IUser {
  id: string
  username: string
  likability: number
  battery: number
  badges: IBadge[]
  verifiedAt: Date
}
interface UserModel extends IUser, Document {}
const UserSchema = new Schema({
  id: String,
  username: String,
  likability: Number,
  badges: [BadgeSchema],
  verifiedAt: Date
})

const UserModel = model<UserModel>('user', UserSchema)
const BadgeModel = model<BadgeModel>('badge', BadgeSchema)

async function setUserData(data: IUser) {
  await new UserModel(data).save()
}

export async function isVerified(id: string): Promise<boolean> {
  return await UserModel.findOne({ 'id': id }).exec() !== null
}

export async function getDataOfUser(user: User, existThen: (user: User, data: IUser) => Promise<void>, notVerifiedThen: (user: User) => Promise<void> = (async _ => {})) {
  if(await isVerified(user.id)) await existThen(user, <IUser>await UserModel.findOne({ 'id': user.id }).exec())
  else await notVerifiedThen(user)
}

export async function getDataOfUserId(id: string, existThen: (id: string, data: IUser) => Promise<void>, notVerifiedThen: (id: string) => Promise<void> = (async _ => {})) {
  if(await isVerified(id)) await existThen(id, <IUser>await UserModel.findOne({'id': id}).exec())
  else await notVerifiedThen(id)
}

export async function updateUserData(user: User, data: IUser, notVerifiedThen: (user: User) => Promise<void> = async (_) => {}) {
  if(await isVerified(user.id)) await setUserData(data)
  else await notVerifiedThen(user)
}

export async function updateUserDataId(id: string, data: IUser, notVerifiedThen: (user: string) => Promise<void> = async (_) => {}) {
  if(await isVerified(id)) await setUserData(data)
  else await notVerifiedThen(id)
}

export async function verifyUser(user: User) {
  if (!await isVerified(user.id))
    await setUserData({
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

export async function initDB() {
  await mongoose.connect("mongodb://xsi:xsi@localhost:27017/xsi-data?authSource=admin&authMechanism=SCRAM-SHA-1")
}