import { Command } from "../core/interfaces";
import os from "os";
import { execSync } from 'child_process';

function getCPUName() {
  try {
    // Thực hiện lệnh lscpu và chuyển kết quả thành chuỗi
    const lscpuOutput = execSync('lscpu', { encoding: 'utf-8' });

    // Tìm dòng chứa thông tin CPU name
    const cpuNameLine = lscpuOutput.split('\n').find(line => line.includes('Model name:'));

    // Trích xuất tên CPU từ dòng đó
    const cpuName = cpuNameLine!.split(':').pop()!.trim();

    return cpuName;
  } catch (error) {
    console.error('Error retrieving CPU name:', error);
    return null;
  }
}

function uptime(time: number) {
  let totalSeconds = time / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  // console.log(totalSeconds);

  // return `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`;
  return (
    (days == 0 ? "" : days + " ngày ") +
    (hours == 0 ? "" : hours + " giờ ") +
    (minutes == 0 ? "" : minutes + " phút ") +
    (seconds == 0 ? "" : seconds + " giây")
  );
}

const formatBytesToGB = (bytes: number) => {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2); // Chuyển đổi byte sang gigabyte và làm tròn đến 2 chữ số thập phân
};

const formatMBToGB = (MB: number) => {
  return (MB / (1024)).toFixed(2); // Chuyển đổi byte sang gigabyte và làm tròn đến 2 chữ số thập phân
};

export const command: Command = {
  name: "uptime",
  aliases: ["info", "upt"],
  description: "Xem thông tin về hoạt động của bot",
  groups: "All",
  noPrefix: true,
  cooldown: 5,
  permission: "everyone",
  execute: async (api, event, args) => {
    const ping = Date.now() - event.timestamp;
    const memoryUsage = process.memoryUsage();
    const memoryUsed = formatBytesToGB(memoryUsage.heapTotal);
    const uptimeString = uptime(Date.now() - api.uptime);
    let maxGB = process.env.SERVER_MEMORY ? formatMBToGB(+process.env.SERVER_MEMORY) : formatBytesToGB(os.totalmem())
    let cpu = os.cpus()[0].model == "unknown" ? getCPUName() : os.cpus()[0].model;

    api.sendMessage(`
🤖 *Bot Info* (${ping}ms)
⏳ Bot đã hoạt động: *${uptimeString}*
✨ Bot Đang ở trong *${await api.BotAPI.getNumberOfGroup()}* groups
🖥️ CPU: *${cpu}* (${process.arch})
💾 Memory used: *${memoryUsed}/${maxGB} GB*
`,
      event.threadID,
      event.messageID
    );
  },
};
