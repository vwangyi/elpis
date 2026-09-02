import fs from "fs-extra";
import ora from "ora";
import chalk from "chalk";
import path from "path";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

export function isUnicodeSupported() {
  if (process.platform !== "win32") {
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(process.env.WT_SESSION) || // 是否是windows终端
    Boolean(process.env.TERMINUS_SUBLIME) || // 是否Terminus (<0.2.27)
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
    process.env.TERM_PROGRAM === "Terminus-Sublime" ||
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty" ||
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
  );
}

// 删除文件夹
export async function removeDir(dir) {
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: "yellow",
  }).start();

  try {
    await fs.remove(resolveApp(dir));
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`));
  }
  catch (err) { 
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`));
    console.log(err);
    return;
  }
}


