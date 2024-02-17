import { Function } from "../interfaces/index.ts";
import { guilds, users } from "./data.ts";
import { reloadCommands, reloadEvents } from "./reload.ts";

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
};
 
