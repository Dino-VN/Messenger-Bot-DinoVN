import { Event } from "../interfaces/index.ts";

export const event: Event = {
  name: ["message", "message_reply"],
  async execute(api, event) {
    if (!api.config.DAILY_CHAT) return;
    let groupID = event.threadID;

    api.global.dailyModule = api.global.dailyModule || {};
    api.global.dailyModule[groupID] = api.global.dailyModule[groupID] || {
      daily: [],
      monthly: [],
      yearly: []
    };
    const daily = api.global.dailyModule[groupID].daily
    const monthly = api.global.dailyModule[groupID].monthly
    const yearly = api.global.dailyModule[groupID].yearly

    const dailyIndex = daily.findIndex((obj: any) => obj.id == event.senderID);
    const monthlyIndex = monthly.findIndex((obj: any) => obj.id == event.senderID);
    const yearlyIndex = yearly.findIndex((obj: any) => obj.id == event.senderID);

    if (dailyIndex > -1) {
      daily[dailyIndex].messages += 1;
      api.global.dailyModule[groupID].daily = daily;
    } else {
      daily.push({ id: event.senderID, messages: 1 });
      api.global.dailyModule[groupID].daily = daily;
    }
    if (monthlyIndex > -1) {
      monthly[monthlyIndex].messages += 1;
      api.global.dailyModule[groupID].monthly = monthly;
    } else {
      monthly.push({ id: event.senderID, messages: 1 });
      api.global.dailyModule[groupID].monthly = monthly;
    }
    if (yearlyIndex > -1) {
      yearly[yearlyIndex].messages += 1;
      api.global.dailyModule[groupID].yearly = yearly;
    } else {
      yearly.push({ id: event.senderID, messages: 1 });
      api.global.dailyModule[groupID].yearly = yearly;
    }
  }
}