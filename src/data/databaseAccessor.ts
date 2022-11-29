import { User } from "discord.js"
import * as mongoose from "mongoose"
import { HydratedDocument, model, Model, Schema } from "mongoose"

interface IBadge {
  badgeId: number
}
type BadgeModel = Model<IBadge>
const BadgeSchema = new Schema<IBadge, BadgeModel>({
  badgeId: {
    type: Number,
    default: -1
  }
})
export type BadgeData = HydratedDocument<IBadge>

interface IUser {
  id: string
  username: string
  likability: number
  battery: number
  badges: IBadge[]
  badgeUpdateAt: Date
  verifiedAt: Date
}
interface IUserMethods {
  equipBadge(id: number): void
  getLikeLevel(): number
}
type UserModel = Model<IUser, {}, IUserMethods>
const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  likability: { type: Number, default: 0 },
  battery: { type: Number, default: 100 },
  badges: { type: [BadgeSchema], default: [] },
  badgeUpdateAt: { type: Date, default: Date.now },
  verifiedAt: {type: Date, required: true }
})
UserSchema.method('equipBadge', function equipBadge(id: number) {
  this.badges.push({ badgeId: id })
  this.badgeUpdateAt = new Date()
})
UserSchema.method('getLikeLevel', function getLikeLevel(): number {
  if(this.likability <= -6) return 0
  else if(this.likability <= 29) return 1
  else if(this.likability <= 199) return 2
  else if(this.likability <= 699) return 3
  else if(this.likability <= 1499) return 4
  else return 5
})
export type UserData = HydratedDocument<IUser, IUserMethods>

interface IBadgeMessage {
  messageId: string,
  userId: string
}
type BadgeMessageModel = Model<IBadgeMessage, {}>
const BadgeMessageSchema = new Schema<IBadgeMessage, BadgeMessageModel>({
  messageId: String,
  userId: String
})
export type BadgeMessageData = HydratedDocument<IBadgeMessage>

const UserModel = model<IUser, UserModel>('user', UserSchema)
const BadgeModel = model<IBadge, BadgeModel>('badge', BadgeSchema)
const BadgeMessageModel = model<IBadgeMessage, BadgeMessageModel>('badge_message', BadgeMessageSchema)

async function setUserData(data: UserData) {
  await data.save()
}

export async function isVerified(id: string): Promise<boolean> {
  return await UserModel.findOne({ 'id': id }).exec() !== null
}

export async function getDataOfUser(user: User, existThen: (user: User, data: UserData) => Promise<void>, notVerifiedThen: (user: User) => Promise<void> = (async _ => {})) {
  if(await isVerified(user.id)) await existThen(user, <UserData>await UserModel.findOne({ 'id': user.id }).exec())
  else await notVerifiedThen(user)
}

export async function getDataOfUserId(id: string, existThen: (id: string, data: UserData) => Promise<void>, notVerifiedThen: (id: string) => Promise<void> = (async _ => {})) {
  if(await isVerified(id)) await existThen(id, <UserData>await UserModel.findOne({'id': id}).exec())
  else await notVerifiedThen(id)
}

export async function updateUserData(user: User, data: UserData, notVerifiedThen: (user: User) => Promise<void> = async (_) => {}) {
  if(await isVerified(user.id) && user.id === data.id) await setUserData(data)
  else await notVerifiedThen(user)
}

export async function updateUserDataId(id: string, data: UserData, notVerifiedThen: (user: string) => Promise<void> = async (_) => {}) {
  if(await isVerified(id) && id === data.id) await setUserData(data)
  else await notVerifiedThen(id)
}

export async function getRankerBadge(limit: number): Promise<Array<UserData>> {
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
      { "$sort": { "length": -1, "badgeUpdateAt": 1 } },
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
    await setUserData(new UserModel({
      id: user.id,
      username: user.username,
      likability: 0,
      battery: 100,
      badges: [],
      badgeUpdateAt: new Date(),
      verifiedAt: new Date()
    }))
}

export async function initDB() {
  await mongoose.connect("mongodb://xsi:xsi@localhost:27017/xsi-data?authSource=admin&authMechanism=SCRAM-SHA-1")
}