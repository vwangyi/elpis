const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const MD5 = require('spark-md5');

const app = express();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.get('/xixi', (request, response) => {
  // 处理分片上传
  console.log('处理分片上传');
  response.send('xixi');
});

// 解决跨域问题
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  req.method === 'OPTIONS'
    ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!')
    : next();
});

// 使用 bodyParser中间件 解析body参数
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '1024mb'
  })
);

// 检测文件是否存在
const exists = function exists(path) {
  return new Promise(resolve => {
    fs.access(path, fs.constants.F_OK, err => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
};

// 创建文件并写入到指定的目录 & 返回客户端结果
const writeFile = function writeFile(res, path, file, filename, stream) {
  return new Promise((resolve, reject) => {
    if (stream) {
      try {
        let readStream = fs.createReadStream(file.path),
          writeStream = fs.createWriteStream(path);
        readStream.pipe(writeStream);
        readStream.on('end', () => {
          resolve();
          fs.unlinkSync(file.path);
          res.send({
            code: 0,
            codeText: 'upload success',
            originalFilename: filename,
            servicePath: path.replace(__dirname, HOSTNAME)
          });
        });
      } catch (err) {
        reject(err);
        res.send({
          code: 1,
          codeText: err
        });
      }
      return;
    }
    fs.writeFile(path, file, err => {
      if (err) {
        reject(err);
        res.send({
          code: 1,
          codeText: err
        });
        return;
      }
      resolve();
      res.send({
        code: 0,
        codeText: 'upload success',
        originalFilename: filename,
        servicePath: path.replace(__dirname, HOSTNAME)
      });
    });
  });
};

// 基于multiparty插件实现文件上传处理 & form-data解析
const uploadDir = `${__dirname}/upload`;
const multiparty_upload = function multiparty_upload(req, auto) {
  typeof auto !== 'boolean' ? (auto = false) : null;
  let config = {
    maxFieldsSize: 200 * 1024 * 1024
  };
  if (auto) config.uploadDir = uploadDir;
  return new Promise(async (resolve, reject) => {
    // await delay();
    new multiparty.Form(config).parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        fields,
        files
      });
    });
  });
};

// 单文件上传处理「FORM-DATA」
app.post('/upload_single', async (req, res) => {
  try {
    let { files } = await multiparty_upload(req, true);
    let file = (files.file && files.file[0]) || {};
    res.send({
      code: 0,
      codeText: 'upload success',
      originalFilename: file.originalFilename,
      servicePath: file.path.replace(__dirname, HOSTNAME)
    });
  } catch (err) {
    res.send({
      code: 1,
      codeText: err
    });
  }
});

app.post('/upload_single_name', async (req, res) => {
  try {
    let { fields, files } = await multiparty_upload(req);
    let file = (files.file && files.file[0]) || {},
      filename = (fields.filename && fields.filename[0]) || '',
      path = `${uploadDir}/${filename}`,
      isExists = false;
    // 检测是否存在
    isExists = await exists(path);
    if (isExists) {
      res.send({
        code: 0,
        codeText: 'file is exists',
        originalFilename: filename,
        servicePath: path.replace(__dirname, HOSTNAME)
      });
      return;
    }
    writeFile(res, path, file, filename, true);
  } catch (err) {
    res.send({
      code: 1,
      codeText: err
    });
  }
});

// 单文件base64上传
app.post('/upload_single_base64', async (req, res) => {
  let file = req.body.file,
    filename = req.body.filename,
    spark = new MD5.ArrayBuffer(),
    suffix = /\.([0-9a-zA-Z]+)$/.exec(filename)[1],
    isExists = false,
    path;
  file = decodeURIComponent(file);
  file = file.replace(/^data:image\/\w+;base64,/, '');
  file = Buffer.from(file, 'base64');
  spark.append(file);
  path = `${uploadDir}/${spark.end()}.${suffix}`;
  // await delay();
  // 检测是否存在
  isExists = await exists(path);
  if (isExists) {
    res.send({
      code: 0,
      codeText: 'file is exists',
      originalFilename: filename,
      servicePath: path.replace(__dirname, HOSTNAME)
    });
    return;
  }
  writeFile(res, path, file, filename, false);
});

// 大文件切片上传 & 合并切片 大文件切片上传
const merge = function merge(HASH, count) {
  return new Promise(async (resolve, reject) => {
    let path = `${uploadDir}/${HASH}`,
      fileList = [],
      suffix,
      isExists;
    isExists = await exists(path);
    if (!isExists) {
      reject('HASH path is not found!');
      return;
    }
    fileList = fs.readdirSync(path);
    if (fileList.length < count) {
      reject('the slice has not been uploaded!');
      return;
    }
    fileList
      .sort((a, b) => {
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
      })
      .forEach(item => {
        !suffix ? (suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1]) : null;
        fs.appendFileSync(
          `${uploadDir}/${HASH}.${suffix}`,
          fs.readFileSync(`${path}/${item}`)
        );
        fs.unlinkSync(`${path}/${item}`);
      });
    fs.rmdirSync(path);
    resolve({
      path: `${uploadDir}/${HASH}.${suffix}`,
      filename: `${HASH}.${suffix}`
    });
  });
};
app.post('/upload_chunk', async (req, res) => {
  try {
    let { fields, files } = await multiparty_upload(req);
    let file = (files.file && files.file[0]) || {},
      filename = (fields.filename && fields.filename[0]) || '',
      path = '',
      isExists = false;
    // 创建存放切片的临时目录
    let [, HASH] = /^([^_]+)_(\d+)/.exec(filename);
    path = `${uploadDir}/${HASH}`;
    !fs.existsSync(path) ? fs.mkdirSync(path) : null;
    // 把切片存储到临时目录中
    path = `${uploadDir}/${HASH}/${filename}`;
    isExists = await exists(path);
    if (isExists) {
      res.send({
        code: 0,
        codeText: 'file is exists',
        originalFilename: filename,
        servicePath: path.replace(__dirname, HOSTNAME)
      });
      return;
    }
    writeFile(res, path, file, filename, true);
  } catch (err) {
    res.send({
      code: 1,
      codeText: err
    });
  }
});
app.post('/upload_merge', async (req, res) => {
  let { HASH, count } = req.body;
  try {
    let { filename, path } = await merge(HASH, count);
    res.send({
      code: 0,
      codeText: 'merge success',
      originalFilename: filename,
      servicePath: path.replace(__dirname, HOSTNAME)
    });
  } catch (err) {
    res.send({
      code: 1,
      codeText: err
    });
  }
});
app.get('/upload_already', async (req, res) => {
  let { HASH, suffix } = req.query;
  let path = `${uploadDir}/${HASH}`,
    fileList = [];
  intact = 0;
  try {
    if (fs.existsSync(`${uploadDir}/${HASH}.${suffix}`)) {
      intact = 1;
    } else {
      fileList = fs.readdirSync(path);
      fileList = fileList.sort((a, b) => {
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
      });
    }
    res.send({
      code: 0,
      codeText: '',
      fileList: fileList,
      intact: intact
    });
  } catch (err) {
    res.send({
      code: 0,
      codeText: '',
      fileList: fileList,
      intact: intact
    });
  }
});

app.get('/hello', (req, res) => {
  console.log('有人访问');
  res.send('hello world');
});

app.use(express.static('./'));

// 兜底处理 没有匹配上  返回404
app.use((req, res) => {
  res.status(404);
  res.send('404 NOT FOUND!');
});
