import { api, event } from "../interfaces/Map";
import { configs } from "./data";

export async function getPrefix(api: api, event: event, id: string) {
  // Thực hiện câu lệnh SQL SELECT
  const idToFind = id; // Thay id cụ thể bạn muốn tì

  // Thực hiện truy vấn với tham số id
  const result = await configs.findById(idToFind)

  if(!result) return "!"

  return result!.prefix || "!"
}