import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

export function isUnicodeSupported() {
  if (process.platform !== 'win32') {
    return process.env.TERM !== 'linux'; // Linux console (kernel)
  }

  return (
    Boolean(process.env.WT_SESSION) || // 是否是windows终端
    Boolean(process.env.TERMINUS_SUBLIME) || // 是否Terminus (<0.2.27)
    process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
    process.env.TERM_PROGRAM === 'Terminus-Sublime' ||
    process.env.TERM_PROGRAM === 'vscode' ||
    process.env.TERM === 'xterm-256color' ||
    process.env.TERM === 'alacritty' ||
    process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
  );
}

// 删除文件夹
export async function removeDir(dir) {
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: 'yellow'
  }).start();

  try {
    await fs.remove(resolveApp(dir));
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`));
  } catch (err) {
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`));
    console.log(err);
    return;
  }
}

/**
 * @param {string} message 询问提示语句
 * @returns {Object} 根据name属性获取用户输入的值{confirm: true/false}
 */
export const inquirerConfirm = async message => {
  const answer = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message
  });
  return answer;
};

export const inquirerChoose = async (message, choices, type = 'list') => {
  const answer = await inquirer.prompt({
    type,
    name: 'choose',
    message,
    choices
  });
  return answer;
};

/**
 * @param {Array} messages  询问提示语句数组
 * @returns {Object} 结果对象
 */
export const inquirerInputs = async messages => {
  const answers = await inquirer.prompt(
    messages.map(msg => {
      return {
        name: msg.name,
        type: 'input',
        message: msg.message
      };
    })
  );
  return answers;
};

/**
 * @param {string} message 询问提示的值
 * @returns {Object} 根据name属性获取用户输入的值{input: xxxxxx}
 */
export const inquirerInput = async message => {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'input',
    message
  });
  return answer;
};

export function npmInstall(dir) {
  const spinner = ora('正在安装依赖......').start();

  if (
    shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`).code !== 0
  ) {
    console.log(
      logSymbols.error,
      chalk.yellowBright('对不起,依赖安装失败,请手动安装')
    );
    shell.exit(1);
  }
  spinner.succeed(chalk.greenBright('~~~依赖安装成功~~~'));
  spinner.succeed(chalk.greenBright('~~~项目创建完成~~~'));

  shell.exit(1);
}

export async function changePackageJson(name, info) {
  try {
    const pkg = await fs.readJson(resolveApp(`${name}/package.json`));

    Object.keys(info).forEach(item => {
      if (item === 'name') {
        pkg[item] = info[item] && info[item].trim() ? info[item].trim() : name;
      } else if (item === 'keywords' && info[item] && info[item].trim()) {
        pkg[item] = info[item].split(',');
      } else if (info[item] && info[item].trim()) {
        pkg[item] = info[item];
      }
    });

    await fs.writeJson(resolveApp(`${name}/package.json`), pkg, { spaces: 2 });
  } catch (err) {
    console.log(
      logSymbols.error,
      chalk.red('对不起,修改自定义package.json失败,请手动修改')
    );
    console.log(err);
  }
}
