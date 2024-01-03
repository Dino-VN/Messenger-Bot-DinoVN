import child_process from "child_process";

const child = child_process.spawn("npm", ["run", "start"], {
  stdio: ["inherit", "pipe", "inherit"],
});

child.stdout.on("data", (data) => {
  console.log(data.toString());
});