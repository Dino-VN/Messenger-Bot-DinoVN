import { api } from "../interfaces/Map.ts";
import { Event } from "../interfaces/index.ts";
import { guilds, users } from "../module/data.ts";

export const event: Event = {
  name: ["event"],
  async execute(api, event) {
    if (event.logMessageType == "log:unsubscribe" && event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
      const groupIdToDelete = event.threadID;
  
      if (event.isGroup && !await guilds.findById(groupIdToDelete)) guilds.findByIdAndDelete(groupIdToDelete);
    } else if (event.logMessageType == "log:subscribe" && event.logMessageData.addedParticipants.some((i: any) => i.userFbId == api.getCurrentUserID())) {
      const targetId = event.threadID;
  
      if (event.isGroup && !await guilds.findById(targetId)) {
        const guildData = new guilds({
          _id: targetId,
        })
        await guildData.save()
      }
    }
  },
};
