import botConfig from "../../../bot.config.js";
import { Function } from "../interfaces/index.ts";
import { DailyChat } from "../module/DailyChat.ts";
import { BotAPI } from "../module/api.ts";
import { reloadCommands, reloadEvents } from "../module/reload.ts";

export const functionFile: Function = {
  async execute(api) {
    api.BotAPI = BotAPI;
    if(botConfig.DAILY_CHAT) await DailyChat(api)
  },
};
