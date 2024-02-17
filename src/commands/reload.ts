import { Collection } from "@discordjs/collection";
import { Command, Event } from "../core/interfaces";
import fs from "fs";

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

    const type = args[0] ? args[0].toLowerCase() : "all";
    if (!type || type == "all") {
      api.setMessageReaction("⏱️", event.messageID, async () => { }, true);
      const commands = await api.BotAPI.reloadCommands(api, event);
      const events = await api.BotAPI.reloadEvents(api, event);
      api.sendMessage(
        `Đã reload lại ${commands?.susccess} lệnh${commands?.failed !== 0 ? `(${commands?.failed} lỗi)` : ""} ${events?.susccess} events${events?.failed !== 0 ? `(${events?.failed} lỗi)` : ""}`,
        event.threadID,
        event.messageID,
      );
      console.info("------------------");
      console.info(`Reload lại lệnh và sự kiện của bot`);
      console.info(`Thành công ${commands?.susccess} lệnh`);
      console.info(`Lỗi ${commands?.failed} lệnh`);
      console.info(`Thành công ${events?.susccess} events`);
      console.info(`Lỗi ${events?.failed} events`);
      console.info("------------------");
    } else if (type == "command" || type == "c") {
      api.setMessageReaction("⏱️", event.messageID, async () => { }, true);
      const commands = await api.BotAPI.reloadCommands(api, event);
      api.sendMessage(
        `Đã reload lại ${commands?.susccess} lệnh${commands?.failed !== 0 ? `(${commands?.failed} lỗi)` : ""}`,
        event.threadID,
        event.messageID,
      );
      console.info("------------------");
      console.info(`Reload lại lệnh của bot`);
      console.info(`Thành công ${commands?.susccess} lệnh`);
      console.info(`Lỗi ${commands?.failed} lệnh`);
      console.info("------------------");
    } else if (type == "event" || type == "e") {
      api.setMessageReaction("⏱️", event.messageID, async () => { }, true);
      const events = await api.BotAPI.reloadEvents(api, event);
      api.sendMessage(
        `Đã reload lại ${events?.susccess} events${events?.failed !== 0 ? `(${events?.failed} lỗi)` : ""}`,
        event.threadID,
        event.messageID,
      );
      console.info("------------------");
      console.info(`Reload sự kiện của bot`);
      console.info(`Thành công ${events?.susccess} events`);
      console.info(`Lỗi ${events?.failed} events`);
      console.info("------------------");
    }
  },
};
