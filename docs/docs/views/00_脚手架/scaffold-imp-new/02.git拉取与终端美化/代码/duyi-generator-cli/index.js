#! /usr/bin/env node
import clone from "./gitClone.js";
import figlet from "figlet";
import chalk from "chalk";

console.log("\r\n" + chalk.greenBright.bold(figlet.textSync("duyi-cli", {
  font: "Standard",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
})))

console.log(`\r\n Run ${chalk.cyan(`duyi-cli <command> --help`)} for detailed usage of given command.`)


await clone("yingside/vue-cli-template", "vue-cli-temp");
