# Messenger Bot
## Code này chỉ có 1 người code nên có gì hãy pull request fix giúp mình nhé
- [Cách Tải](#cách-tải)
- [Cài đặt các package](#cài-đặt-các-package)
- [Setup env](#setup-env)
- [Chỉnh config của bot](#chỉnh-config-của-bot)
- [Cách sử dụng](#cách-sử-dụng)
- [Cách chạy](#cách-chạy)
---
### Cách Tải
**Tải bằng git**
```
git clone https://github.com/Dino-VN/Messenger-Bot-DinoVN.git
```
### Cài đặt các package
```
# Dùng npm
npm install
# Dùng yarn
yarn install
# Dùng pnpm
pnpm install
```
### Setup env 
Vào [đây](https://www.mongodb.com/) để tạo tài khoản mongodb\
Tạo file `.env` và chèn các dòng sau:
```
MONGO_URI=mongodb+srv://... 
```
Thay `mongodb+srv://...` bằng địa chỉ của tài khoản mongodb của bạn\
### Chỉnh config của bot
Vào file `bot.config.js` và chỉnh sửa theo ý muốn\
File `bot.config.js` mặc định:
```js
// !! Những thứ quan trong như MONGO_URI vẫn sẽ ở trong .env !!

export default {
// ------ Admin Config ------
  OWNER_ID: "100016495471276",
  // Cho phép owner dùng lệnh admin mà không cần là admin của nhóm
  ADMIN_BYPASS: false,
  // Cho phép owner dùng lệnh admin mà không cần là bot là admin của nhóm
  BOT_ADMIN_BYPASS: false,
// ------ Bot Config------
  PERFIX: "!",
  TIMEZONE: "Asia/Ho_Chi_Minh",
// ------ Update ------
  UPDATE: true,
  AUTO_UPDATE: false,
// ------ Module ------
  // Tự động ban những người cố tình phá bot lấy từ api của Dino Bot (Đồng bộ ban với bot Dino Bot)
  GLOBAL_BAN: true,
  DAILY_CHAT: false,
// ------ Uptime ------
  UPTIME: false,
  // Nếu dùng như kiểu replit thì không cần set PORT
  // PORT: 3000,
}
```
### Cách sử dụng
 - 📁src/commands - nơi chứa lệnh
    - Xem file lệnh ví dụ tại [đây](https://github.com/Dino-VN/Messenger-Bot-DinoVN/blob/Core/src/commands/ping.ts) lệnh ping khi dùng lệnh `!ping` bot sẽ trả lời lại pong
 - 📁src/events - nơi chứa các event
    - Xem file lệnh ví dụ tại [đây](https://github.com/Dino-VN/Messenger-Bot-DinoVN/blob/Core/src/events/LogAllMessage.ts.example) event đó sẽ log tất cả tin nhắn bot nhìn thấy
 - 📁src/functions - nơi chứa functions tất cả file trong này sẽ được chạy khi bot khởi động
### Chạy bot
Chạy bot bằng package manager
```
# Dùng npm
npm start
# Dùng yarn
yarn start
```
Hoặc chạy bằng lệnh node
```
node index.js
```
---
### Update log
**22/2/2014**
```ts
// Thêm
api.sendCommemt(string | {
  body: string,
  attachment: fs.ReadStream
}, postId: string, callback?: (error, data))
```