import { Function } from "../interfaces/index.ts";
import fetch from "node-fetch";
import { users } from "../module/data.ts";

const API = "https://bot.d1n0saur.xyz/api/ban_list";

export const functionFile: Function = {
  async execute(api) {
    if (!api.config.PUBLIC_BAN) return
    try {
      const response = await fetch(API);
      const data = await response.json();
      // Use the data retrieved from the API here
      data.forEach(async (i: any) => {
        let uid = i.uid
        const reason = i.reason
  
        const user = await users.findById(uid)
        if (!user) {
          const newUser = new users({
            _id: uid,
            banned: true,
            banReason: reason
          })
          await newUser.save()
        } else {
          if (user.banned) return
          await users.findByIdAndUpdate(uid, {
            banned: true,
            banReason: reason
          })
        }
      });
    } catch (e) {
      // console.log(e)
    }
  },
};
