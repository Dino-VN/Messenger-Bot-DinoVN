import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";
import FormData from "form-data";
import { getFb_dtsg } from "./tool";

function getGUID() {
  let _0x161e32 = Date.now(),
    _0x4ec135 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (_0x32f946) {
        let _0x141041 = Math.floor((_0x161e32 + Math.random() * 16) % 16);
        _0x161e32 = Math.floor(_0x161e32 / 16);
        let _0x31fcdd = (
          _0x32f946 == "x" ? _0x141041 : (_0x141041 & 0x3) | 0x8
        ).toString(16);
        return _0x31fcdd;
      }
    );
  return _0x4ec135;
}

export async function uploadImageToFacebook(api: any, file: fs.ReadStream) {
  try {
    const formData = new FormData();
    formData.append("file", file, {
      filename: "1096452.jpg",
      contentType: "image/jpeg",
    });

    const cookie = JSON.parse(fs.readFileSync("./appstate.json", "utf8"))
      .map((x: { key: any; value: any }) => `${x.key}=${x.value}`)
      .join("; "); // Thay thế bằng chuỗi cookie của bạn

    let fbDtsgValue = await getFb_dtsg();

    var options = {
      method: "POST",
      url: "https://www.facebook.com/ajax/ufi/upload",
      params: {
        av: api.getCurrentUserID(),
        profile_id: api.getCurrentUserID(),
        source: "19",
        target_id: api.getCurrentUserID(),
        __user: api.getCurrentUserID(),
        __a: "1",
        fb_dtsg: fbDtsgValue,
      },
      headers: {
        cookie: cookie,
        authority: "www.facebook.com",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "content-type":
          "multipart/form-data; boundary=---011000010111000001101001",
      },
      data: formData,
    };

    const responseData = await axios.request(options);
    let data = JSON.parse(responseData.data.slice(9));
    let fileID = data.payload.fbid;
    return fileID;
  } catch (error) {
    throw new Error(error!.toString());
  }
}

export async function sendCMT(
  api: any,
  text: string,
  postId: string,
  fileID?: string
) {
  // const delay = parseInt(args[2]);

  // Thay đổi base64 feedback_id thành dựa trên postId
  const feedback_id = Buffer.from("feedback:" + postId).toString("base64");

  // Gửi tin nhắn xác nhận bắt đầu spam
  // api.sendMessage("Đang tiến hành spam", event.threadID, event.messageID);

  const ss1 = getGUID();
  const ss2 = getGUID();

  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "CometUFICreateCommentMutation",
    fb_api_caller_class: "RelayModern",
    doc_id: "4744517358977326",
    variables: JSON.stringify({
      displayCommentsFeedbackContext: null,
      displayCommentsContextEnableComment: null,
      displayCommentsContextIsAdPreview: null,
      displayCommentsContextIsAggregatedShare: null,
      displayCommentsContextIsStorySet: null,
      feedLocation: "TIMELINE",
      feedbackSource: 0,
      focusCommentID: null,
      includeNestedComments: false,
      input: {
        attachments: fileID ? [{ media: { id: fileID } }] : null,
        feedback_id: feedback_id,
        formatting_style: null,
        message: {
          ranges: [],
          text: text,
        },
        is_tracking_encrypted: true,
        tracking: [],
        feedback_source: "PROFILE",
        idempotence_token: "client:" + ss1,
        session_id: ss2,
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19),
      },
      scale: 3,
      useDefaultActor: false,
      UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
    }),
  };

  const res = JSON.parse(
    await api.httpPost("https://www.facebook.com/api/graphql/", form)
  );
  return res;
}
