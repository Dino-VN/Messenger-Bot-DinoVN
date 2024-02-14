import { api } from "../interfaces/Map.ts";
import { Event } from "../interfaces/index.ts";
import { guilds, users } from "../module/data.ts";

export const event: Event = {
  name: ["message", "message_reply"],
  async execute(api, event) {
    const targetId = event.threadID;
    
    if(event.isGroup) {
      if (!await guilds.findById(targetId)) {
        const guildData = new guilds({
          _id: targetId,
        })
        await guildData.save()
      }
    } else {
      if (!await users.findById(targetId)) {
        const userData = new users({
          _id: targetId,
        })
        await userData.save()
      }
    }
  },
};
