import chalk from "chalk";

function loadingAnimation(
  text = "",
  chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
  delay = 100
) {
  let x = 0;

  return setInterval(function () {
    process.stdout.write("\r" + chalk.gray("[") + chars[x++] + chalk.gray("] ") + text);
    x = x % chars.length;
  }, delay);
}

function doneAnimation(
  text = "",
  loadingAnimation: any
) {
  clearInterval(loadingAnimation);
  process.stdout.write("\r" + chalk.gray("[") + chalk.green("✓") + chalk.gray("] ") + text + "\n");
}

function errAnimation(
  text = "",
  loadingAnimation: any
) {
  clearInterval(loadingAnimation);
  process.stdout.write("\r" + chalk.gray("[") + chalk.red("X") + chalk.gray("] ") + text + "\n");
}

console.info = (message: any, ...optionalParams: any[]) => {
  console.log(chalk.gray("[") + chalk.green("INFO") + chalk.gray("]"), message, ...optionalParams);
}

console.error = (...data: any[]) => {
  console.log(chalk.gray("[") + chalk.red("ERROR") + chalk.gray("]"), ...data);
}

console.warn = (...data: any[]) => {
  console.log(chalk.gray("[") + chalk.yellow("WARN") + chalk.gray("]"), ...data);
}

export {
  loadingAnimation,
  doneAnimation,
  errAnimation,
}