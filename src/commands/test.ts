import { Command } from "../core/interfaces";

export const command: Command = {
  name: "test",
  aliases: [],
  description: "test",
  groups: "Groups",
  permission: "everyone",
  execute: async (api, event, args) => {
    api.sendMessage(JSON.stringify(await api.BotAPI.dailyModule.getYearly(api, event.threadID)), event.threadID, event.messageID);
  },
};