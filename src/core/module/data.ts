import { model, Schema } from "mongoose";

const guilds = model("guilds", new Schema({
  _id: String,
}))

const users = model("users", new Schema({
  _id: String,
}))

const configs = model("configs", new Schema({
  _id: String,
  prefix: String,
}))

const restarts = model("restarts", new Schema({
  _id: String,
  messageId: String,
  message: String,
}))

export { guilds, users, configs, restarts }