const glob = require('glob');
const path = require('path');
const { sep } = path;

module.exports = app => {
  const servicesPath =
    path.resolve(
      process.cwd(),
      `.${sep}app${sep}services`
    );
  let fileList = glob.sync(
    path.resolve(
      servicesPath,
      `.${sep}**${sep}**.js`
    )
  );
  fileList = fileList.filter(
    item =>
      !item.endsWith(
        'index.js'
      )
  );

  /**
   * services 对象
   * key 是 文件名
   * value 是 导出的类实例化的对象
   */
  const services =
    fileList.reduce(
      (prev, filePath) => {
        const key = filePath
          .split(sep)
          .slice(-1)[0]
          .split('.')[0];

        const service = require(
          path.resolve(
            filePath
          )
        );

        const ServiceModel =
          typeof service ===
          'function'
            ? service(app)
            : null;

        if (
          typeof ServiceModel ===
          'function'
        ) {
          prev[key] =
            new ServiceModel();
        }
        return prev;
      },
      {}
    );
  app.services = services;
  console.info(
    `-- [init] load services done --`
  );
};
