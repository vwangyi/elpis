import chalk from 'chalk';
import figlet from 'figlet';
import { name } from './constants.js';

const onepieceStyle = chalk.greenBright.bold(
  figlet.textSync(name, {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  })
);
const tip = `运行 ${chalk.cyan(`${name} <command> --help`)} 用于查看指定命令的详细用法。`;

export function onepiece(program) {
  program
    .name(name)
    .description('这是自定义的脚手架命令行工具，用于快速搭建项目。')
    .usage('<command> [options]')
    .on('--help', () => {
      console.log('\r\n' + onepieceStyle);
      console.log(`\r\n ${tip}`);
    });
}
