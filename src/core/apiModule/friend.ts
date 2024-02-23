import axios from "axios";
import { api } from "../interfaces/Map";
import { getFb_dtsg } from "./tool";
import fs from "fs";

export async function getRecommendedFriends(
  api: api,
  callback?: (error: any, data?: any) => void
) {
  const cookie = JSON.parse(fs.readFileSync("./appstate.json", "utf8"))
    .map((x: { key: any; value: any }) => `${x.key}=${x.value}`)
    .join("; "); // Thay thế bằng chuỗi cookie của bạn

  var options = {
    method: 'POST',
    url: 'https://www.facebook.com/api/graphql',
    headers: {
      cookie: cookie,
      'content-type': 'application/x-www-form-urlencoded',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    },
    data: {
      av: '61556257198316',
      __user: '61556257198316',
      fb_dtsg: await getFb_dtsg(),
      fb_api_caller_class: 'RelayModern',
      fb_api_req_friendly_name: 'FriendingCometSuggestionsRootQuery',
      variables: '{"scale":1}',
      doc_id: '7176500739131881'
    }
  };
  
  let res = await axios.request(options)

  if (!res.data) {
    if (callback) callback(res);
  }

  // await api.httpPost("https://www.facebook.com/api/graphql/", form));
  if (res.data.data) {
    if (callback) callback(null, res.data.data);
  } else {
    if (callback) callback(res.data);
  }
}

export async function sendFrendRequest(
  api: api,
  userID: string | string[],
  callback?: (error: any, data?: any) => void
) {
  let friend_requestee_ids = [];
  if (typeof userID === "string") friend_requestee_ids.push(userID);
  else friend_requestee_ids = userID;
  let form = {
    av: api.getCurrentUserID(),
    __user: api.getCurrentUserID(),
    fb_dtsg: await getFb_dtsg(),
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
    variables: JSON.stringify({
      input: {
        attribution_id_v2:
          "ProfileCometTimelineListViewRoot.react,comet.profile.timeline.list,via_cold_start,1708664941026,938092,190055527696468,,",
        friend_requestee_ids: friend_requestee_ids,
        refs: [null],
        source: "profile_button",
        warn_ack_for_ids: [],
        actor_id: "61556257198316",
        client_mutation_id: "2",
      },
      scale: 1,
    }),
    doc_id: "24773035982311104",
  };

  const res = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form))
  if (res.data) {
    if (callback) callback(null, res.data);
  } else {
    if (callback) callback(res);
  }
}
