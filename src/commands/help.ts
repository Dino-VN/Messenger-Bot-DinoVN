import { Command } from "../core/interfaces";
import fs from "fs";

export const command: Command = {
  name: "help",
  aliases: [],
  description: "Hiện tất cả các lệnh có thể dùng lệnh",
  groups: "All",
  permission: "everyone",
  execute: async (api, event, args) => {
    // api.sendMessage('pong', event.threadID, event.messageID);
    const ThreadInfo = await api.getThreadInfo(event.threadID);

    let commands = [];

    const commandFiles = fs
      .readdirSync("./src/commands/")
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      let command = await import(`./${file}`);
      command = command.command;
      if (command && command.name || command && command.run) {
        if (command.permission == "everyone" ||
          command.permission == "admin" &&
          ThreadInfo.adminIDs.includes(event.senderID) ||
          command.permission == "owner" &&
          event.senderID == process.env.OWNER_ID
        ) {
          commands.push({
            name: command.name,
            aliases: command.aliases,
            description: command.description || "none",
            // example: command.example,
            // cooldown: command.cooldown,
            // isGroup: command.isGroup,
          });
        }
      }
    }
    
    try {
      const help =
        `Những lệnh hiện có ${event.isGroup && ThreadInfo.threadName != null? `trong \`${ThreadInfo.threadName}\`` : "của bot"}:\n` +
        commands.map(
          (command) =>
            `${process.env.BOT_PERFIX}${command.name} ${
              command.aliases.length == 0
                ? ""
                : "[" +
                  command.aliases.map((alias: string) => alias).join(", ") +
                  "]"
            }\n${command.description}`
        ).join("\n");
      // console.log(help);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.sendMessage(help, event.senderID);
    } catch (error) {
      console.log(error);
      api.sendMessage("Có vẻ bot không nhắn được với bạn hãy kết bạn với bot!", event.threadID, event.messageID);
    }
  },
};
