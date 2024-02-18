import EventEmitter from "events";
import { Function } from "../interfaces/index.ts";
import { guilds, users } from "./data.ts";
import { reloadCommands, reloadEvents } from "./reload.ts";
import { api } from "../interfaces/Map.ts";

export const BotAPI = {
  /** Lấy số lương nhóm bot đang ở */
  getNumberOfGroup: async function (): Promise<number> {
    return await guilds.countDocuments({});
  },
  /** Lấy số lương người dùng bot từng thấy chat */
  getNumberOfUser: async function (): Promise<number> {
    return await users.countDocuments({});
  },

  /** Dùng để reload lại tất cả lệnh */
  reloadCommands: reloadCommands,
  /** Dùng để reload lại tất cả sự kiện */
  reloadEvents: reloadEvents,
  // dailyModule: new EventEmitter()
  dailyModule: {
    events: new EventEmitter(),
    getDaily: async function (api: api, groupID: string) {
      const result = api.global.dailyModule
      if (!result || !result[groupID]) throw new Error("Không có dữ liệu nhóm")
      return result[groupID].daily
    },
    getMonthly: async function (api: api, groupID: string) {
      const result = api.global.dailyModule
      if (!result || !result[groupID]) throw new Error("Không có dữ liệu nhóm")
      return result[groupID].monthly
    },
    getYearly: async function (api: api, groupID: string) {
      const result = api.global.dailyModule
      if (!result || !result[groupID]) throw new Error("Không có dữ liệu nhóm")
      return result[groupID].yearly
    }
  }
};

