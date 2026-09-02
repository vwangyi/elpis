import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';

/**
 * // const github = 'vwangyi/template-vue3#vue2';
// const name = './template';

// await clone(github, name).catch(() => void 0);
 */
function clone(remote, name, options = false) {
  const spinner = ora('正在拉取项目......').start();

  return new Promise((resolve, reject) => {
    download(remote, name, options, err => {
      if (err) {
        spinner.fail(chalk.red('拉取失败'));
        reject();
        return;
      }

      spinner.succeed(chalk.green('拉取成功'));
      resolve();
    });
  });
}
export default clone;
