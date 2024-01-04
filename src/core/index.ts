import { loadingAnimation, doneAnimation, errAnimation } from "./module/console.ts";
import "dotenv/config";

// const fbchat = require("facebook-chat-api")
import fbchat from "@xaviabot/fca-unofficial";
// import fbchat from "nhatcoder-fb-api";
import fs from "fs";

import { Collection } from "@discordjs/collection";

import { Command, Cooldown, Event, Function } from "./interfaces/index.ts";
import { api } from "./interfaces/Map.ts";

const events: Collection<string, Collection<string, Event>> = new Collection();
const commands: Collection<string, Command> = new Collection();
const aliases: Collection<string, Command> = new Collection();
const cooldowns: Collection<string, Cooldown> = new Collection();

const CommandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".ts"));

for (const file of CommandFiles) {
  try {
    import(`../commands/${file}`).then(command => {
      command = command.command;
      // const command = require(`../commands/${file}`).command;
      // console.log(command)
      if (!command || !command.name || !command.execute)
        console.error(`Hãy khiểm tra lại lệnh ${file}`);
      else {
        commands.set(command.name, command);
    
        if (command.aliases.length !== 0) {
          command.aliases.forEach((alias: any) => {
            aliases.set(alias, command);
          });
        }
      }
    })
  } catch (error) {
    console.error(`Lỗi khi load lệnh ${file}:`, error)
  }
}

const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".ts"));
for (const file of eventFiles) {
  try {
    import(`../events/${file}`).then(event => {
      // const event = require(`../events/${file}`).event;
      event = event.event;
      if (!event || !event.name || !event.execute) console.error(`Hãy khiểm tra lại event ${file}`);
      else {
        event.name.forEach((name: any) => {
          // console.log(name)
          // if(event.type == name) event.execute(api, event)
          if (!events.has(file)) {
            events.set(file, new Collection<string, Event>());
          }
          const eventfile = events.get(file)
          eventfile!.set(name, event);
        });
      }
    });
  } catch (error) {
    console.error(`Lỗi khi load event ${file}:`, error)
  }
}

let restartCount = 0

function handleRestartCount() {
	restartCount++;
	setTimeout(() => {
		restartCount--;
	}, 1 * 60 * 1000);
}

function loadMqtt(api: api) {
  const event = api.listenMqtt(async (err: any, event: any) => {
    // console.log(api.guilds)
    if (err) {
      console.error(err);
      handleRestartCount()
      if(err.error == 'Not logged in') return console.log("Đã dừng thử chạy lại Mqtt vì cần thay thế appstate")
      if(restartCount > 3) return console.error("Thử chạy lại Mqtt 3 lần vẫn lỗi hãy kiểm tra lại!")
      console.info("Đang chạy lại Mqtt do lỗi")
      loadMqtt(api);
      return;
    }

    // console.log(events)
    events.map(eventfile => {
      let hevent = eventfile.get(event.type);
      // console.log(hevent)
      if (hevent) (hevent as Event).execute(api, event);
    });
  });
  setTimeout(() => {
    event.stopListening()
    loadMqtt(api)
  }, 1 * 60 * 60 * 1000)
}

function startBot() {
  if(!fs.existsSync("./appstate.json")) {
    console.error("Không tìm thấy appstate.json, hãy tạo mới")
    if (process.send) process.send("stop")
    return 
  }
  let loading = loadingAnimation("Đang kết nối với Facebook...");
  
  fbchat(
    { appState: JSON.parse(fs.readFileSync("./appstate.json", "utf8")) }, 
    {
      listenEvents: true,
      autoMarkDelivery: false,
      // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
      updatePresence: true,
      logLevel: "silent"
    },
    async (err: any, api: any) => {
      if (err) {
        if (err.code == "ETIMEDOUT") {
          errAnimation("Đang kết nối với Facebook...", loading)
          console.warn("Lỗi timeout, đang thử lại");
          startBot();
        } else {
          errAnimation("Đang kết nối với Facebook...", loading)
          console.error(err);
          if (process.send) process.send("stop")
        }
        return;
      }

      doneAnimation("Đang kết nối với Facebook...", loading)

      api.commands = commands;
      api.aliases = aliases;
      api.cooldowns = cooldowns;
      api.events = events;

      const userId = api.getCurrentUserID()
      const user = await api.getUserInfo([userId])

      console.info(`Đã kết nối với ${user[userId].name} (${userId})`)

      console.info(`Đã load ${commands.size} lệnh`)
      console.info(`Đã load ${events.size} events`)

      let NfunctionFile = 0

      const functionFiles = fs
        .readdirSync("./src/functions")
        .filter((file) => file.endsWith(".ts"));
      for (const file of functionFiles) {
        try {
          let functionFile = await import(`../functions/${file}`);
          functionFile = functionFile.functionFile;
          // const functionFile = require(`../functions/${file}`).functionFile;
          if (!functionFile || !functionFile.execute) console.error(`Hãy khiểm tra lại function ${file}`);
          else {
            functionFile.execute(api)
            NfunctionFile++
          }
        } catch (error) {
          console.error(`Lỗi khi load function ${file}:`, error)
        }
      }

      console.info(`Đã load ${NfunctionFile} functions file`)

      api.uptime = Date.now();

      loadMqtt(api);
    }
  );
}

startBot();
export { events, commands, aliases, cooldowns };
