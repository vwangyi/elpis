import shell from "shelljs"
import chalk from "chalk"
import clone from "./gitClone.js";
import logSymbols from "./logSymbols.js";
import fs from "fs-extra";
import { removeDir } from "./utils.js";
import {inquirerConfirm} from "./interactive.js";

const initAction = async (name, option) => { 
  if (!shell.which("git")) { 
    console.log(logSymbols.error, chalk.redBright("对不起,运行脚本必须先安装git"));
    shell.exit(1);
  }
  // 验证name输入是否符合规范
  if (name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) { 
    console.log(logSymbols.error, chalk.redBright("对不起,项目名称存在非法字符"));
    return;
  }

  // 验证是否存在${name}同名文件夹,如果存在
  // 1. 如果没有-f --force选项,提示用户是否删除同名文件夹
  // 2. 如果有-f --force选项,直接删除同名文件夹
  if (fs.existsSync(name) && !option.force) {
    console.log(logSymbols.warning, `已经存在项目文件夹${chalk.yellowBright(name)}`);
    //询问是否删除文件夹
    const answer = await inquirerConfirm(`是否删除文件夹${chalk.yellowBright(name)}?`);
    console.log(answer)
    if (answer.confirm) {
      //删除
      await removeDir(name);
    }
    else {
      console.log(logSymbols.error, chalk.redBright(`对不起,项目创建失败,存在同名文件夹,${chalk.yellowBright(name)}`));
      return;
    }
  }
  else if (fs.existsSync(name) && option.force) { 
    console.log(logSymbols.warning, `已经存在项目文件夹${chalk.yellowBright(name)},强制删除`);
    //删除
    await removeDir(name);
  }

  // await clone("yingside/vue-cli-template", name);
}

export default initAction;
