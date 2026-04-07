#! /usr/bin/env node

// #! /usr/bin/env node  表示当前文件是调用系统变量node脚本 执行本js文件 必须在第一行写
// 执行 npm link 就可以获取一个 elpis命令

const {
  program
} = require('commander');

// inquirer v8 及之前：纯 CommonJS 模块  inquirer v9+：转为 ES 模块
// 如果在 node的commonjs 导入 esm模块的包 则有些区别
const inquirer = require('inquirer');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const spinner = ora();
spinner.text = 'loading';
/**
 * elpis --help
 * elpis create xxx xxx xxx
 */

/**
 * 执行 elpis --help
 */
// if (process.argv[2] === '--help') {
//     console.log('@@@', process.argv)
// }
program.option(
  '-f --framwork <framwork>',
  '设置框架'
);
program
  .command(
    'create <project> [other...]'
  )
  .alias('crt')
  .description('创建项目')
  .action(
    async (project, args) => {
      console.log(
        project,
        args
      );
      const framworkList = [
        {
          name: 'koa',
          http: 'https://cnb.cool/elpis-code/test.git'
        },
        {
          name: 'express',
          http: 'https://cnb.cool/elpis-code/test.git'
        },
        {
          name: 'egg',
          http: 'https://cnb.cool/elpis-code/test.git'
        }
      ];
      const { framwork } =
        await inquirer.prompt(
          [
            {
              type: 'list',
              name: 'framwork',
              choices:
                framworkList.map(
                  item =>
                    item.name
                ),
              message:
                '请选择'
            }
          ]
        );
      const item =
        framworkList.find(
          item =>
            item.name ===
            framwork
        );

      console.log(
        '选择了',
        project,
        item
      );
      spinner.start();
      download(
        `direct:${item.http}`,
        `./${project}`,
        { clone: true },
        err => {
          spinner.stop();
          spinner.info(
            '休息'
          );
          if (err) {
            spinner.fail(
              '失败'
            );

            console.log(
              chalk.blue(
                '去运行'
              )
            );
            console.log(
              chalk.red(
                '去运行'
              )
            );
            console.log(
              chalk.rgb(
                122,
                122,
                122
              )('去运行')
            );
          } else {
            spinner.succeed(
              '成功'
            );
          }
        }
      );
    }
  );
program.parse(process.argv);
