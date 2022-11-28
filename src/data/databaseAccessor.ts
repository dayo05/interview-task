import { User } from "discord.js"
import * as mongoose from "mongoose"
import { model, Model, Schema, Types } from "mongoose"

export interface IBadge {
  badgeId: number
}
interface BadgeModel extends IBadge, Types.Subdocument {}
const BadgeSchema = new Schema({
  badgeId: {
    type: Number,
    default: -1
  }
})

export interface IUser {
  id: string
  username: string
  likability: number
  battery: number
  badges: IBadge[]
  badgeUpdateAt: Date
  verifiedAt: Date
}
interface UserModel extends IUser, Document {}
const UserSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  likability: { type: Number, default: 0 },
  battery: { type: Number, default: 100 },
  badges: { type: [BadgeSchema], default: [] },
  badgeUpdateAt: { type: Date, default: Date.now },
  verifiedAt: {type: Date, required: true }
})

export interface IBadgeMessage {
  messageId: string,
  userId: string
}
interface BadgeMessageModel extends IBadgeMessage, Document {}
const BadgeMessageSchema = new Schema({
  messageId: String,
  userId: String
})

const UserModel = model<UserModel>('user', UserSchema)
const BadgeModel = model<BadgeModel>('badge', BadgeSchema)
const BadgeMessageModel = model<BadgeMessageModel>('badge_message', BadgeMessageSchema)

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

export async function getRankerBadge(limit: number): Promise<Array<IUser>> {
  return await UserModel.aggregate(
    [
      {
        "$project": {
          "id": 1,
          "username": 1,
          "likability": 1,
          "verifiedAt": 1,
          "badges": 1,
          "badgeUpdateAt": 1,
          "length": { "$size": "$badges" }
        }
      },
      { "$sort": { "length": -1, "badgeUpdateAt": -1 } },
      { "$limit": limit }
    ]
  ).exec()
}

export async function getBadgeMessageData(messageId: string, existsThen: (userId: string) => Promise<void>, notExistsThen: () => Promise<void> = async() => {}) {
  let uid = (await BadgeMessageModel.findOne({'messageId': messageId}).exec())?.userId
  if(uid !== null) await existsThen(uid!)
  else await notExistsThen()
}

export async function addBadgeMessage(messageId: string, userId: string) {
  await new BadgeMessageModel({
    messageId: messageId,
    userId: userId
  }).save()
}

export async function verifyUser(user: User) {
  if (!await isVerified(user.id))
    await setUserData({
      id: user.id,
      username: user.username,
      likability: 0,
      battery: 100,
      badges: [],
      badgeUpdateAt: new Date(),
      verifiedAt: new Date()
    })
}

export function getLikeLevel(data: IUser): number {
  return 0
}

export async function initDB() {
  await mongoose.connect("mongodb://xsi:xsi@localhost:27017/xsi-data?authSource=admin&authMechanism=SCRAM-SHA-1")
}