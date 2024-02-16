// !! Những thứ quan trong như MONGO_URI vẫn sẽ ở trong .env !!

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
  // Tự động ban những người cố tình phá bot lấy từ api của Dino Bot (Đồng bộ ban với bot Dino VN)
  PUBLIC_BAN: true,
// ------ Update ------
  UPDATE: true,
  AUTO_UPDATE: false,
// ------ Uptime ------
  UPTIME: false,
  // Nếu dùng như kiểu replit thì không cần set PORT
  // PORT: 3000,
}