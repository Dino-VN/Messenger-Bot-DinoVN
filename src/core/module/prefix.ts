import { api, event } from "../interfaces/Map";
import { guilds, users } from "./data";

export async function getPrefix(api: api, event: event, id: string) {
  // Thực hiện câu lệnh SQL SELECT
  const idToFind = id; // Thay id cụ thể bạn muốn tì

  let result

  // Thực hiện truy vấn với tham số id
  if(event.isGroup) result = await guilds.findById(idToFind)
  else result = await users.findById(idToFind)

  if(!result) return "!"

  return result!.prefix || "!"
}