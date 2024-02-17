import { Function } from "../interfaces/index.ts";
import { BotAPI } from "../module/api.ts";
import { reloadCommands, reloadEvents } from "../module/reload.ts";

export const functionFile: Function = {
  async execute(api) {
    api.BotAPI = BotAPI;
    api.global = {}
  },
};
