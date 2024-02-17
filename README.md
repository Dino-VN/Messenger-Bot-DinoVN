# Messenger Bot
## Code này chỉ có 1 người code nên có gì hãy pull request fix giúp mình nhé
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
export default {
// ------ Admin Config ------
  OWNER_ID: "100000000000000",
  // Cho phép owner dùng lệnh admin mà không cần là admin của nhóm
  ADMIN_BYPASS: false,
  // Cho phép owner dùng lệnh admin mà không cần là bot là admin của nhóm
  BOT_ADMIN_BYPASS: false,
// ------ Bot Config------
  PERFIX: "!",
  TIMEZONE: "Asia/Ho_Chi_Minh",
  // Tự động ban những người cố tình phá bot lấy từ api của Dino Bot (Đồng bộ ban với bot Dino Bot)
  GLOBAL_BAN: true,
// ------ Update ------
  UPDATE: true,
  AUTO_UPDATE: false,
// ------ Uptime ------
  UPTIME: false,
  // Nếu dùng như kiểu replit thì không cần set PORT
  // PORT: 3000,
}
```
###C hạy bot
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
