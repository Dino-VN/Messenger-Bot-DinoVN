import { Function } from "../interfaces/index.ts";
import { DailyChat } from "../module/DailyChat.ts";
import { BotAPI } from "../module/api.ts";
import { reloadCommands, reloadEvents } from "../module/reload.ts";

export const functionFile: Function = {
  async execute(api) {
    api.BotAPI = BotAPI;
    if(api.config.DAILY_CHAT) await DailyChat(api)
  },
};
