import { Collection } from "@discordjs/collection";
import { api, event } from "./Map";

interface Run {
  (
    api: api,
    event: event,
    args: string[],
  ): any;
}

/**
 * @property {String} name - Tên của lệnh
 * @property {Array} description - idk
 * @property {String[]} aliases - Tên của lệnh phụ
 * @property {Any} groups - Nhóm mà lệnh sẽ chạy `all` để cho dùng trong tất cả các nhóm.\
 * Ví dụ 1: `"All"` - chạy trong tất cả các nhóm\
 * Ví dụ 2: `[ "group1", "group2" ]` - chạy trong nhóm 1 và 2 (group1 và group2 phải là id)
 * @property {number} cooldown - Chỉnh delay của lệnh mặc đinh 3s. **Số tính theo giây*
 * @property {String} permission - Quyền của lệnh "owner" | "admin" | "everyone"
 * @property {function} execute - Nơi chứa function chạy của lệnh
 *
 * @example
 * ```js
 * // Ví dụ lệnh ping
 * export const command: Command = {
 *   name: 'ping',
 *   aliases: ['p'],
 *   groups: "All",
 *   permission: "everyone",
 *   execute: async(api, event, args) => {
 *     api.sendMessage('pong', event.threadID, event.messageID);
 *   }
 * }
 * ```
 */

export interface Command {
  /** Tên của lệnh */
  name: string;
  /** idk */
  description?: string;
  /** Tên của lệnh phụ */
  aliases?: string[];
  noPrefix?: boolean;
  /** Nhóm mà lệnh sẽ chạy `all` để cho dùng trong tất cả các nhóm.\
   * Vd 1: `"All"` - chạy trong tất cả các nhóm và chat riêng\
   * Vd 2: `"Groups"` - chạy trong tất cả các nhóm\
   * Vd 3: `[ "group1", "group2", ... ]` - chỉ dùng được trong nhóm 1 và 2 **group1 và group2 phả là id**
   */
  groups: "All" | "Groups" | string[];
  /** Chỉnh delay của lệnh mặc đinh 3s. **Số tính theo giây** */
  cooldown?: number;
  /** Quyền của lệnh */
  permission: "owner" | "admin" | "everyone",
  /** Nơi chứa function chạy của lệnh\
   * Nhũng thông tin mà function chạy của lệnh có thể truy cập
   * @param api - Api từ bot
   * @param event - Event từ bot
   * @param args - Các tham số truyền vào
   * @param CollectionCommands - Commands Collection của bot
   * @param CollectionAliases - Aliases Collection của bot
   * @param CollectionEvent - Events Collection của bot
   */
  execute: Run;
}
