import { cooldowns, events } from "..";
import { api, event } from "./Map";

interface Run {
    (api: api, event: event): any;
}

/**
 * @property {string[]} name - Tên của sự kiện\
 * Vd 1: ["message"]\
 * Vd 2: ["message", "message_reply"]
 * @property {function} run - Nơi chứa function chạy của sự kiện
 * 
 * @example
 * ```js
 * // Ví dụ sự kiện nhắn lại nội dung tin nhắn vừa nhắn
 * export const event: Event = {
 *   name: ["message"],
 *   execute(api, event, CollectionEvent) {
 *      api.sendMessage(event.body, event.threadID)
 *   },
 * };
 * ```
 */
export interface Event{
    /**
     * Tên của sự kiện\
     * Vd 1: ["message"]\
     * Vd 2: ["message", "message_reply"]
     */
    name: string[];
    /** Nơi chứa function chạy của sự kiện\
     * Nhũng thông tin mà function chạy của sự kiện có thể truy cập:
     * @param api - Api từ bot
     * @param event - Event từ bot
     * @param CollectionEvent - Events Collection của bot
    */
    execute: Run
}