import { model, Schema } from "mongoose";

const guilds = model("guilds", new Schema({
  _id: String,
  prefix: String,
  daily: [
    {
      id: String,
      messages: Number,
    },
  ],
  monthly: [
    {
      id: String,
      messages: Number,
    },
  ],
  yearly: [
    {
      id: String,
      messages: Number,
    },
  ],
}))

const users = model("users", new Schema({
  _id: String,
  prefix: String,
  token: String,
  banned: Boolean,
  public_ban: Boolean,
  PBanReason: String,
  banReason: String,
}))

export { guilds, users }