import { api, event } from "../interfaces/Map.ts";
import { Collection } from "@discordjs/collection";
import { Command, Event } from "../interfaces";
import fs from "fs";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const importModule = async (file: string) => {
  // @ts-ignore
  const module = await import(new URL(`${file}?v=${getRandomInt(99)}`, import.meta.url));
  return module;
};

async function reloadCommands(api: api, event: event, callback?: (data: {
  susccess: number;
  failed: number;
}) => void) {
  const commands = api.commands;
  const aliases = api.aliases;

  let data = {
    susccess: 0,
    failed: 0,
  };

  commands.clear();
  aliases.clear();

  const commandFiles = fs
    .readdirSync("./src/commands/")
    .filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    try {
      let command = await importModule(`../../commands/${file}`);
      command = command.command;
      if (!command || !command.name || !command.execute) return;
      commands.set(command.name, command);

      if (command.aliases && command.aliases.length !== 0) {
        command.aliases.forEach((alias: any) => {
          aliases.set(alias, command);
        });
      }
      data.susccess++;
    } catch (e) {
      console.error(`Lỗi khi tải lại lệnh(${file}):`, e);
      data.failed++;
    }
    const core_commandFiles = fs
      .readdirSync("./src/core/commands/")
      .filter((file) => file.endsWith(".ts"));
    for (const file of core_commandFiles) {
      try {
        let command = await importModule(`../commands/${file}`);
        command = command.command;
        if (!command || !command.name || !command.execute) return;
        commands.set(command.name, command);

        if (command.aliases && command.aliases.length !== 0) {
          command.aliases.forEach((alias: any) => {
            aliases.set(alias, command);
          });
        }
        data.susccess++;
      } catch (e) {
        console.error(`Lỗi khi tải lại lệnh(${file}) core command hãy báo lỗi trên github:`, e);
        data.failed++;
      }
    }
  }
  if (callback) callback(data);
  return data
}

async function reloadEvents(api: api, event: event, callback?: (data: {
  susccess: number;
  failed: number;
}) => void) {
  const events = api.events;

  events.clear();

  let data = {
    susccess: 0,
    failed: 0,
  };

  const eventFiles = fs
    .readdirSync("./src/events/")
    .filter((file) => file.endsWith(".ts"));
  for (const file of eventFiles) {
    try {
      let event = await importModule(`../../events/${file}`);
      event = event.event;
      if (!event || !event.name || !event.execute) return;
      events.set(event.name, event);
      data.susccess++;
    } catch (e) {
      console.error(`Lỗi khi tải lại event(${file}):`, e);
      data.failed++;
    }
  }
  const core_eventFiles = fs
    .readdirSync("./src/core/events/")
    .filter((file) => file.endsWith(".ts"));
  for (const file of core_eventFiles) {
    try {
      let event = await importModule(`../events/${file}`);
      event = event.event;
      if (!event || !event.name || !event.execute) return;
      events.set(event.name, event);
      data.susccess++;
    } catch (e) {
      console.error(`Lỗi khi tải lại event(${file}) core event hãy báo lỗi trên github:`, e);
      data.failed++;
    }
  }
  if (callback) callback(data);
  return data
}

export {
  reloadCommands,
  reloadEvents,
}