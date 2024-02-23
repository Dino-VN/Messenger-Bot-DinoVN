import axios from "axios";
import { api } from "../interfaces/Map";
import { getFb_dtsg } from "./tool";

export async function getRecommendedFriends(
  api: api,
  callback?: (error: any, data?: any) => void
) {
  var options = {
    method: 'POST',
    url: 'https://www.facebook.com/api/graphql',
    headers: {
      cookie: 'c_user=61556257198316; xs=32%253AxEiMiQv-ZcfKbg%253A2%253A1708345308%253A-1%253A10601%253A%253AAcVhRFlUQD7JavBcIlSRZ1pJ-j37NzxfSer_YrVw9Xc; fr=1NCBJveR9rD13raHP.AWW9W3ZP57MfrnGqkfz8Z3p00Fo.Bl2DmR.qD.AAA.0.0.Bl2DmR.AWUf04ZqV7Q; sb=4znYZUHk6nevu0BKM9iL3Qf7; ps_n=0; ps_l=0',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    },
    data: {
      av: '61556257198316',
      __user: '61556257198316',
      fb_dtsg: 'NAcMp3e1gvU4r5qHkBjVXqGDiRcUw1hY8-oCXVnzSSAisXQw_kvRUfw:32:1708345308',
      fb_api_caller_class: 'RelayModern',
      fb_api_req_friendly_name: 'FriendingCometSuggestionsRootQuery',
      variables: '{"scale":1}',
      doc_id: '7176500739131881'
    }
  };
  
  const res = JSON.parse(await axios.request(options))

  // await api.httpPost("https://www.facebook.com/api/graphql/", form));
  if (res.data) {
    if (callback) callback(null, res.data);
  } else {
    if (callback) callback(res);
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
