import { Stream } from "stream";
import fs from "fs";
import { sendCMT, uploadImageToFacebook } from "./apiModule/sendComment";

export interface APIModule {
  sendComment: (body: string | { body: string, attachment: Stream | fs.ReadStream }, postId: string, callback?: (error: any, data: any) => void) => void;
}

export function API(api: any) {
  api.sendComment = async (body: string | { body: string, attachment: fs.ReadStream }, postId: string, callback?: (error: any, data?: any) => void) => {
    if(typeof body === "string") {
      let res = await sendCMT(api, body, postId);
      if (res.data.comment_create) {
        if(callback) callback(null, res);
      } else {
        if(callback) callback(res);
      }
    } else if (typeof body === "object") {
      let fileID = await uploadImageToFacebook(api, body.attachment)
      let res = await sendCMT(api, body.body, postId, fileID);
      if (res.data.comment_create) {
        if(callback) callback(null, res);
      } else {
        if(callback) callback(res);
      }
    }
  };

  return api;
}