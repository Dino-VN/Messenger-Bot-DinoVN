import { Command } from '../interfaces/index.ts';
import { users } from '../module/data.ts';

export const command: Command = {
  name: 'ban',
  description: "Ban ai đó không được dùng bot nữa, có thể dùng ban list để xem những người đã bị ban",
  groups: "All",
  permission: "owner",
  execute: async(api, event, args) => {
    let uid = "0"
    let reason = "Không có lý do"
 
    if(event.messageReply) {
      uid = event.messageReply.senderID
      if (!args[0]) return api.sendMessage("Vui lòng nhập lý do ban", event.threadID, event.messageID)
      reason = args.join(" ")
    } else if(args[0]) {
      uid = args[0]
      if (!args[1]) return api.sendMessage("Vui lòng nhập lý do ban", event.threadID, event.messageID)
      reason = args.slice(1).join(" ")
    }

    if(uid == "0") return api.sendMessage("Vui lòng nhập ID/Reply người dùng cần ban", event.threadID, event.messageID)
    
    if (uid == "list") {
      const banned = await users.find({banned: true});
      const GBan = await users.find({public_ban: true});
      let text = "Ban list:\n"
      for (const user of banned) {
        text += `${user._id} - ${user.banReason}\n`
      }
      for (const user of GBan) {
        text += `${user._id} - ${user.PBanReason} - Global Ban\n`
      }
      return api.sendMessage(text, event.threadID, event.messageID)
    } else {
      const user = await users.findById(uid)
      if(!user) {
        const newUser = new users({
          _id: uid,
          banned: true,
          banReason: reason
        })
        await newUser.save()
      } else {
        if(user.banned) return api.sendMessage("Người dùng này đã bị ban", event.threadID, event.messageID);
        await users.findByIdAndUpdate(uid, {
          banned: true,
          banReason: reason
        })
      }

      return api.sendMessage(`Đã ban ${uid} với lý do: ${reason}`, event.threadID, (error, message) => {
        setTimeout(() => {
          api.unsendMessage(message.messageID)
        }, 1000 * 10)
      }, event.messageID)
    }
  }
}