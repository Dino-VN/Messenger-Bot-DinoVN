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
        const public_ban = await users.find({ public_ban: true })

        const public_ban_ids = public_ban!.map((u: any) => u.uid);
        const users_not_in_data = public_ban_ids.filter((uid: string) => !data.find((user: any) => user.uid === uid));

        users_not_in_data.forEach(async (uid: string) => {
          if (!public_ban.find((u: any) => u.uid === uid)?.banned) users.findByIdAndUpdate(uid, { public_ban: false, banReason: "" })
          else users.findByIdAndUpdate(uid, { public_ban: false })
          console.info(`[PUBLIC_BAN] ${uid} đã được đưa ra khỏi danh sách ban`)
        });

        if (!user) {
          const newUser = new users({
            _id: uid,
            public_ban: true,
            banReason: reason
          })
          await newUser.save()
          console.info(`[PUBLIC_BAN] ${uid} banned với lý do: ${reason}`)
        } else {
          if (user.public_ban) return
          await users.findByIdAndUpdate(uid, {
            public_ban: true,
            banReason: reason
          })
          console.info(`[PUBLIC_BAN] ${uid} banned với lý do: ${reason}`)
        }
      });

      setInterval(() => {
        functionFile.execute(api)
      }, 30 * 60 * 1000)
    } catch (e) {
      // console.log(e)
    }
  },
};
