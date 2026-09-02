// --list
export function template(program) {
  program
    .command('--template')
    .description('查看所有可用模板')
    .action(() => {
      console.log('list');
      // console.log(chalk.yellowBright('模板列表'));
      // templates.forEach((temp, index) => {
      //   console.log(
      //     `(${index + 1}) | ${temp.name} | ${temp.value} | ${temp.desc}`
      //   );
      // });
    });
}
