import shell from "shelljs"
import chalk from "chalk"
import clone from "./gitClone.js";
import logSymbols from "./logSymbols.js";

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

  await clone("yingside/vue-cli-template", "vue-cli-temp");
}

export default initAction;
