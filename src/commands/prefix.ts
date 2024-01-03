import { Command } from '../core/interfaces';
import { configs } from '../core/module/data';

export const command: Command = {
  name: 'prefix',
  aliases: [],
  description: "Lệnh để set prefix",
  groups: "Groups",
  permission: "admin",
  execute: async(api, event, args) => {
    if (!args[0]) return api.sendMessage("Vui lòng nhập prefix cần set", event.threadID, event.messageID);
    if (args[0].length > 5) return api.sendMessage("Prefix không được quá 5 ký tự", event.threadID, event.messageID);

    const idToUpdate = event.threadID; // Thay id cụ thể bạn muốn cập nhật
    const newPrefix = args[0]; // Thay giá trị mới của prefix
    const config = await configs.findById(idToUpdate); // Tìm kiếm config của id đã chọn trước đó

    if(!config) new configs({
      _id: idToUpdate,
      prefix: newPrefix
    }).save();
    else await configs.findByIdAndUpdate(idToUpdate, {prefix: newPrefix}); // Cập nhật giá trị prefix mới cho id đã chọn trước đó
  
    console.log(`Đã cập nhật giá trị prefix (${newPrefix}) cho id ${idToUpdate}`);
    api.sendMessage(`Đã cập lưu prefix mới: \`${newPrefix}\``, event.threadID, event.messageID);
  }
}