import { api } from "./Map";

interface Run {
  (
    api: api,
  ): any;
}

/**
 * @property {function} run - Nơi chứa function chạy của lệnh
 */

export interface Function {
  /** Nơi chứa function chạy của lệnh\
   * Nhũng thông tin mà function có thể truy cập
   * @param api - Api từ bot
   */
  reload?: Run;
  execute: Run;
}
