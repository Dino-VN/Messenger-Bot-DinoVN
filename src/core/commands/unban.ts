import { Command } from '../interfaces/index.ts';
import { users } from '../module/data.ts';

export const command: Command = {
  name: 'unban',
  description: "UnBan ai đó cho phép người đó dùng lại bot",
  groups: "All",
  permission: "owner",
  execute: async(api, event, args) => {
    let uid = "0"
 
    if(event.messageReply) {
      uid = event.messageReply.senderID
    } else if(args[0]) {
      uid = args[0]
    }

    if(uid == "0") return api.sendMessage("Vui lòng nhập ID/Reply người dùng cần ban", event.threadID, event.messageID)

    const user = await users.findById(uid)
    if(!user) {
      return api.sendMessage("Người dùng này không bị ban", event.threadID, event.messageID);
    } else if (user.public_ban) {
      return api.sendMessage("Người dùng này bị Global Ban nếu muốn unban hãy tắt Global Ban trong cài đặt bot", event.threadID, event.messageID);
    } else {
      await users.findByIdAndUpdate(uid, {
        banned: false,
        banReason: ""
      })
    }

    api.sendMessage(`Đã unban ${uid}`, event.threadID, (error, message) => {
      setTimeout(() => {
        api.unsendMessage(message.messageID)
      }, 1000 * 10)
    }, event.messageID)
  }
}