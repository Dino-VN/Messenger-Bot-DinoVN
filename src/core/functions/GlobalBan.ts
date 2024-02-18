import { Function } from "../interfaces/index.ts";
import fetch from "node-fetch";
import { users } from "../module/data.ts";

const colors = {
  reset: "\x1B[0m",
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m",
  brightBlack: "\x1B[90m",
  brightRed: "\x1B[91m",
  brightGreen: "\x1B[92m",
  brightYellow: "\x1B[93m",
  brightBlue: "\x1B[94m",
  brightMagenta: "\x1B[95m",
  brightCyan: "\x1B[96m",
  brightWhite: "\x1B[97m",
};

const API = "https://bot.d1n0saur.xyz/api/ban_list";
let PREFIX = `${colors.red}[Global Ban]${colors.reset}`;

async function GlobalBan(api: any) {
  if (!api.config.GLOBAL_BAN) {
    const public_ban = await users.find({ public_ban: true })
    public_ban.forEach(async (uid) => {
      await users.findByIdAndUpdate(uid._id, { public_ban: false, PBanReason: "" })
      console.info(`${PREFIX} ${uid._id} đã được đưa ra khỏi danh sách ban`)
    });
  }
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
        await users.findByIdAndUpdate(uid, { public_ban: false, PBanReason: "" })
        console.info(`${PREFIX} ${uid} đã được đưa ra khỏi danh sách ban`)
      });

      if (!user) {
        const newUser = new users({
          _id: uid,
          public_ban: true,
          PBanReason: reason
        })
        await newUser.save()
        console.info(`${PREFIX} ${uid} banned với lý do: ${reason}`)
      } else {
        if (user.public_ban) return
        await users.findByIdAndUpdate(uid, {
          public_ban: true,
          PBanReason: reason
        })
        console.info(`${PREFIX} ${uid} banned với lý do: ${reason}`)
      }
    });

    setInterval(() => {
      GlobalBan(api)
    }, 30 * 60 * 1000)
  } catch (e) {
    // console.log(e)
  }
}

export const functionFile: Function = {
  async execute(api) {
    console.info(`Đã load module Global Ban.`)
    await GlobalBan(api)
  },
};
