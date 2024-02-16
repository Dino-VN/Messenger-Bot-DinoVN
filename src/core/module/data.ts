import { model, Schema } from "mongoose";

const guilds = model("guilds", new Schema({
  _id: String,
  prefix: String,
}))

const users = model("users", new Schema({
  _id: String,
  prefix: String,
  token: String,
  banned: Boolean,
  public_ban: Boolean,
  banReason: String,
}))

export { guilds, users }