import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';

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
