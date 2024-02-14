import { Collection } from "@discordjs/collection";
import { Command, Event } from "../core/interfaces";
import fs from "fs";
import { createRequire } from "module";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const importModule = async (file: string) => {
  const module = await import(new URL(`./${file}?v=${getRandomInt(99)}`, import.meta.url));
  return module;
};

export const command: Command = {
  name: "reload",
  aliases: ["r", "rl"],
  description: "Reload lại lệnh và event của bot",
  groups: "All",
  permission: "owner",
  execute: async (api, event, args) => {
    const commands = api.commands;
    const aliases = api.aliases;
    const events = api.events;

    let data: { commands: string[]; events: string[]; functions: string[] } = {
      commands: [],
      events: [],
      functions: [],
    };

    const type = args[0].toLowerCase();
    if (!type || type == "all") {
      api.setMessageReaction(
        "⏱️",
        event.messageID,
        async () => {
          commands.clear();
          aliases.clear();
          events.clear();

          const commandFiles = fs
            .readdirSync("./src/commands/")
            .filter((file) => file.endsWith(".ts"));
          for (const file of commandFiles) {
            // delete require.cache[require.resolve(`./${file}`)];
            
            // evictModule?.(import.meta.resolve(`./${file}`));

            let command = await importModule(file);
            command = command.command;
            if (!command || !command.name || !command.execute) return;
            commands.set(command.name, command);

            data.commands.push(file);

            if (command.aliases && command.aliases.length !== 0) {
              command.aliases.forEach((alias: any) => {
                aliases.set(alias, command);
              });
            }
          }

          const eventFiles = fs
            .readdirSync("./src/events")
            .filter((file) => file.endsWith(".ts"));
          for (const file of eventFiles) {
            // delete require.cache[require.resolve(`../events/${file}`)];

            let event = await importModule(`../events/${file}`);
            event = event.event;
            if (!event || !event.name || !event.execute) return;

            data.events.push(file);

            event.name.forEach((name: any) => {
              if (!events.has(file)) {
                events.set(file, new Collection<string, Event>());
              }
              const eventfile = events.get(file);
              eventfile!.set(name, event);
            });
          }

          api.sendMessage(
            `Đã reload lại ${data.commands.length} lệnh, ${data.events.length} events`,
            event.threadID,
            event.messageID,
          );
          console.info("------------------");
          console.info(`Reload lại lệnh, event và functions của bot`);
          console.info(`${data.commands.length} lệnh`);
          console.info(`${data.events.length} events`);
          // console.info(`${data.functions.length} functions`);
          console.info("------------------");
        },
        true,
      );
    } else if (type == "command" || type == "c") {
      api.setMessageReaction(
        "⏱️",
        event.messageID,
        async () => {
          commands.clear();
          aliases.clear();

          const commandFiles = fs
            .readdirSync("./src/commands/")
            .filter((file) => file.endsWith(".ts"));
          for (const file of commandFiles) {
            // delete require.cache[require.resolve(`./${file}`)];

            let command = await importModule(`./${file}`);
            command = command.command;
            if (!command || !command.name || !command.execute) return;
            commands.set(command.name, command);

            data.commands.push(file);

            if (command.aliases && command.aliases.length !== 0) {
              command.aliases.forEach((alias: any) => {
                aliases.set(alias, command);
              });
            }
          }

          api.sendMessage(
            `Đã reload lại ${data.commands.length} lệnh`,
            event.threadID,
            event.messageID,
          );
          console.info("------------------");
          console.info(`Reload lại lệnh của bot`);
          console.info(`${data.commands.length} lệnh`);
          console.info("------------------");
        },
        true,
      );
    } else if (type == "event" || type == "e") {
      api.setMessageReaction(
        "⏱️",
        event.messageID,
        async () => {
          events.clear();

          const eventFiles = fs
            .readdirSync("./src/events")
            .filter((file) => file.endsWith(".ts"));
          for (const file of eventFiles) {
            // delete require.cache[require.resolve(`../events/${file}`)];

            let event = await importModule(`../events/${file}`);
            event = event.event;
            if (!event || !event.name || !event.execute) return;

            data.events.push(file);

            event.name.forEach((name: any) => {
              if (!events.has(file)) {
                events.set(file, new Collection<string, Event>());
              }
              const eventfile = events.get(file);
              eventfile!.set(name, event);
            });
          }

          api.sendMessage(
            `Đã reload lại ${data.events.length} events`,
            event.threadID,
            event.messageID,
          );
          console.info("------------------");
          console.info(`Reload lại event của bot`);
          console.info(`${data.events.length} events`);
          console.info("------------------");
        },
        true,
      );
    }
  },
};
