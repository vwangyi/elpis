#! /usr/bin/env node
import clone from "./gitClone.js";
import figlet from "figlet";
import chalk from "chalk";
import { program } from "commander";
import { templates } from "./constants.js";
import fs from "fs-extra"
// import pkg from "./package.json" assert { type: "json" };

// import { readFile } from "fs/promises";
// const pkg = JSON.parse(
//   await readFile(new URL("./package.json", import.meta.url))
// )

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pkg = require("./package.json");

const pkg = fs.readJsonSync(new URL("./package.json", import.meta.url));

program.version(pkg.version, "-v, --version");

program
  .name("duyi-cli")
  .description("一个简单的脚手架工具")
  .usage("<command> [options]")
  .on("--help", () => { 
    console.log("\r\n" + chalk.greenBright.bold(figlet.textSync("duyi-cli", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })))

    console.log(`\r\n Run ${chalk.cyan(`duyi-cli <command> --help`)} for detailed usage of given command.`)
  });

program
  .command("create <app-name>")
  .description("创建一个新的项目")
  .option("-t --template [template]","输入模板名称创建项目")
  .option("-f --force","强制覆盖本地同名项目")
  .option("-i --ignore","忽略项目相关描述,快速创建项目")
  .action((name, option) => {
    console.log("创建的项目名字:" + name);
    console.log(option);
  });

program
  .command("list")
  .description("查看所有可用的模板")
  .action(() => { 
    console.log(chalk.yellowBright("所有可用的模板:"));
    templates.forEach((item,index) => {
      console.log(chalk.greenBright(index + 1) + " " + chalk.greenBright(item.name) + " " + chalk.blueBright(item.value) + " " + chalk.blueBright(item.desc));
    });
  })
  

// console.log("\r\n" + chalk.greenBright.bold(figlet.textSync("duyi-cli", {
//   font: "Standard",
//   horizontalLayout: "default",
//   verticalLayout: "default",
//   width: 80,
//   whitespaceBreak: true,
// })))

// console.log(`\r\n Run ${chalk.cyan(`duyi-cli <command> --help`)} for detailed usage of given command.`)


// await clone("yingside/vue-cli-template", "vue-cli-temp");

program.parse(process.argv);

