import { Function } from "../interfaces/index.ts";
import { guilds, users } from "./data.ts";

export const BotAPI = {
  /** Lấy số lương nhóm bot đang ở */
  getNumberOfGroup: async function (): Promise<number> {
    return await guilds.countDocuments({});
  },
  /** Lấy số lương người dùng bot từng thấy chat */
  getNumberOfUser: async function (): Promise<number> {
    return await users.countDocuments({});
  },
};
 
