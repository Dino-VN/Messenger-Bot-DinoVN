import { Stream } from "stream";
import fs from "fs";
import { sendCMT, uploadImageToFacebook } from "./apiModule/sendComment";
import { getFb_dtsg } from "./apiModule/tool";
import { getRecommendedFriends, sendFrendRequest } from "./apiModule/friend";
import { event } from "./interfaces/Map";
import { Collection } from "@discordjs/collection";

export interface APIModule {
  sendComment: (body: string | { body: string, attachment: Stream | fs.ReadStream }, postId: string, callback?: (error: any, data: any) => void) => void;
  getFb_dtsg: () => Promise<string>;
  getRecommendedFriends: (callback?: (error: any, data: any) => void) => void;
  sendFrendRequest: (userID: string | string[], callback?: (error: any, data: any) => void) => void;
  on(name: string[], callback: (event: event) => void): string;
  remove(id: string): void;
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
  api.getFb_dtsg = getFb_dtsg
  api.getRecommendedFriends = (callback?: (error: any, data?: any) => void) => {
    getRecommendedFriends(api, callback);
  }
  api.sendFrendRequest = (userID: string | string[], callback?: (error: any, data?: any) => void) => {
    sendFrendRequest(api, userID, callback);
  }
  api.on = (name: string[], callback: (event: event) => void) => {
    const events = api.global.OnEvents;
    let fileName = Date.now()
    name.forEach((name: any) => {
      // console.log(name)
      // if(event.type == name) event.execute(api, event)
      if (!events.has(fileName)) {
        events.set(fileName, new Collection<string, Event>());
      }
      const eventfile = events.get(fileName)
      eventfile!.set(name, {
        execute: callback
      });
    });
    return fileName;
  }
  api.remove = (id: string) => {
    const events = api.global.OnEvents;
    if(events.has(id)) {
      events.delete(id)
    }
  }
  return api;
}