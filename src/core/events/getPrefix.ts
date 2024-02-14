import { Event } from "../interfaces/index.ts";
import { getPrefix } from "../module/prefix.ts";

export const event: Event = {
  name: ["message", "message_reply"],
  async execute(api, event) {
    if(event.isGroup) {
      const perfix: string = await getPrefix(api, event, event.threadID) || process.env.BOT_PERFIX!;
      try {
        // console.log(ThreadInfo);
        if(!event.body.startsWith(perfix) && api.getCurrentUserID() in event.mentions) {
          const ThreadInfo = await api.getThreadInfo(event.threadID);
          api.sendMessage(
            `Prefix của \`${!ThreadInfo.threadName ? "nhóm đó" : ThreadInfo.threadName}\` là \`${perfix}\``,
            event.senderID
          );
        }
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      const perfix: string = await getPrefix(api, event, event.threadID) || process.env.BOT_PERFIX!;
      try {
        // console.log(ThreadInfo);
        if(!event.body.startsWith(perfix) && api.getCurrentUserID() in event.mentions) {
          api.sendMessage(
            `Prefix của bot là \`${perfix}\``,
            event.senderID
          );
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }
}