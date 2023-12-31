import child_process from "child_process";

const child = child_process.spawn("npm", ["run", "start"], {
  stdio: ["inherit", "pipe", "inherit"],
});

child.stdout.on("data", (data) => {
  console.log(data.toString());
});

child.on("close", (code) => {
  if (code !== 0) {
    console.log("Lệnh npm run start thất bại với mã lỗi:", code);
  } else {
    console.log("Lệnh npm run start thành công");
  }
});