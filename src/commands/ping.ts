import { Command } from '../core/interfaces';

export const command: Command = {
  name: 'ping',
  aliases: ['p'],
  description: "Trả lời lại pong",
  groups: "All",
  permission: "everyone",
  execute: async(api, event, args) => {
    const ping = Date.now() - event.timestamp;
    api.sendMessage(`pong, ${ping} ms`, event.threadID, event.messageID);
  }
}