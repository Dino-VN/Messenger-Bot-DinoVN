import { api } from "./Map";
import { Request as ExpressRequest, Response } from 'express';

interface ExtendedRequest extends ExpressRequest {
  // isAuthenticated(): boolean; // session có thể không tồn tại nếu không được sử dụng
}

interface Run {
  (
    api: api,
    req: ExtendedRequest,
    res: Response,
  ): any;
}

/**
 * @property {function} run - Nơi chứa function chạy của lệnh
 */

export interface Web {
  /** Nơi chứa function chạy của lệnh\
   * Nhũng thông tin mà function có thể truy cập
   * @param req - Thông tin request
   * @param res - Thông tin response
   * @param api - Api từ bot
   */
  execute: Run;
}