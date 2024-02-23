import axios from "axios";
import fs from "fs";
import cheerio from "cheerio";

export async function getFb_dtsg() {
  const url = "https://mbasic.facebook.com/home.php"; // Thay thế URL tương ứng
  
  const cookie = JSON.parse(fs.readFileSync("./appstate.json", "utf8"))
    .map((x: { key: any; value: any }) => `${x.key}=${x.value}`)
    .join("; "); // Thay thế bằng chuỗi cookie của bạn

  const axiosInstance = axios.create({
    headers: {
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      // Thêm các headers khác nếu cần thiết
    },
  });

  const response = await axiosInstance.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const fbDtsgValue = $('input[name="fb_dtsg"]').attr("value");
  return fbDtsgValue;
}