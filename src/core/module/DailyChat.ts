import { Function } from "../interfaces/index.ts";
import fetch from "node-fetch";
import { guilds, users } from "./data.ts";
import cron from "node-cron";
import { group } from "console";
import { api } from "../interfaces/Map.ts";

async function dailyTask(api: any) {
  // console.log('Daily task executed at the end of the day.');
  // Add your code here
  const daily = await guilds.find({})
  api.BotAPI.dailyModule.events.emit('dailyTask', daily.map((i) => {
    return {
      id: i._id,
      messages: i.daily
    }
  }))
  await guilds.updateMany({}, { daily: [] })
  for (const key in api.global.dailyModule) {
    const element = api.global.dailyModule[key];
    api.global.dailyModule[key] = {
      daily: [],
      monthly: element.monthly,
      yearly: element.yearly
    }
  }
}

// Function to be executed monthly at the end of the month
async function monthlyTask(api: any) {
  // console.log('Monthly task executed at the end of the month.');
  // Add your code here
  const monthly = await guilds.find({})
  api.BotAPI.dailyModule.events.emit('monthlyTask', monthly.map((i) => {
    return {
      id: i._id,
      messages: i.monthly
    }
  }))
  await guilds.updateMany({}, { daily: [] })
  for (const key in api.global.dailyModule) {
    const element = api.global.dailyModule[key];
    api.global.dailyModule[key] = {
      daily: element.daily,
      monthly: [],
      yearly: element.yearly
    }
  }
}

// Function to be executed yearly at the end of the year
async function yearlyTask(api: api) {
  // console.log('Yearly task executed at the end of the year.');
  // Add your code here
  const yearly = await guilds.find({})
  api.BotAPI.dailyModule.events.emit('monthlyTask', yearly.map((i) => {
    return {
      id: i._id,
      messages: i.yearly
    }
  }))
  await guilds.updateMany({}, { daily: [] })
  for (const key in api.global.dailyModule) {
    const element = api.global.dailyModule[key];
    api.global.dailyModule[key] = {
      daily: element.daily,
      monthly: element.monthly,
      yearly: []
    }
  }
}

export async function DailyChat(api: api) {
  console.info(`Đã load module Daily Chat.`)
  api.global.dailyModule = {
  }
  await guilds.find({}).then((data) => {
    data.forEach((i) => {
      api.global.dailyModule[i._id] = {
        daily: i.daily,
        monthly: i.monthly,
        yearly: i.yearly
      }
    })
  })
  // Schedule tasks
  cron.schedule('0 0 * * *', () => {
    dailyTask(api)
  }); // Daily at 23:00 (11:00 PM)
  cron.schedule('0 0 1 * *', () => {
    monthlyTask(api)
  }); // Monthly on the 1st day of the month at midnight
  cron.schedule('0 0 1 1 *', () => {
    yearlyTask(api)
  }); // Yearly on the 1st day of January at midnight

  // Keep the process alive to allow cron jobs to run
  process.stdin.resume();

  setInterval(async () => {
    // api.BotAPI.dailyModule.events.emit('dailyTask', [])
    for (const key in api.global.dailyModule) {
      const element = api.global.dailyModule[key];
      await guilds.findByIdAndUpdate(key, {
        daily: element.daily,
        monthly: element.monthly,
        yearly: element.yearly
      })
    }
  }, 1000 * 60)
}
