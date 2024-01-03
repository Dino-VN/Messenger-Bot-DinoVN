import { Event } from "../core/interfaces/index.ts";
import { getPrefix } from "../core/module/prefix.ts";

export const event: Event = {
  name: ["message", "message_reply"],
  async execute(api, event) {
    if(!event.isGroup) return
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
  }
}