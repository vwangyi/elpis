/**
 * 引入xlsx、fs、path、log4js等模块
 */
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var log4js = require('log4js').getLogger('');
var async = require('async');
var util = require('util');

/**
 * 检查创建文件夹
 *
 * @param  {String} url 指定文件夹路径
 * @param  {Number} mode 目录权限
 * @return {Void}
 */
function mkdirSync(url, mode) {
  // 将路径字符串按照 '/' 分割成数组
  var arr = url.split('/');

  // 如果未指定权限，默认为 0755
  mode = mode || 0755;

  // 处理路径中以 '.' 开头的相对路径
  if (arr[0] === '.') {
    //处理 ./aaa
    arr.shift();
  }

  // 处理路径中以 '..' 开头的相对路径
  if (arr[0] == '..') {
    //处理 ../ddd/d
    arr.splice(0, 2, arr[0] + '/' + arr[1]);
  }

  // 递归创建文件夹的函数
  function inner(cur) {
    if (!fs.existsSync(cur)) {
      //如果目录不存在就创建一个
      fs.mkdirSync(cur, mode);
    }
    if (arr.length) {
      inner(cur + '/' + arr.shift());
    }
  }

  // 调用递归函数开始创建目录
  arr.length && inner(arr.shift());
}

/**
 * json转换为字符串
 *
 * @param  {Object} 指定json
 * @return {String}
 */
function jsonToStr(a) {
  // 定义了一个内部函数 j，用于将 JSON 对象转换为字符串
  function j(a, b) {
    var c,
      d,
      g,
      k,
      l = e,
      m,
      n = b[a];
    n &&
      typeof n == 'object' &&
      typeof n.toJSON == 'function' &&
      (n = n.toJSON(a));
    typeof h == 'function' && (n = h.call(b, a, n));
    switch (typeof n) {
      case 'string':
        return i(n); // 如果是字符串，调用 i 函数转义特殊字符
      case 'number':
        return isFinite(n) ? String(n) : 'null'; // 如果是数字，转换为字符串
      case 'boolean':
      case 'null':
        return String(n); // 如果是布尔值或 null，转换为字符串
      case 'object':
        if (!n) return 'null'; // 如果是 null 或者 undefined，返回 "null"
        e += f;
        m = [];
        // 如果是数组，递归处理每个元素
        if (Object.prototype.toString.apply(n) === '[object Array]') {
          k = n.length;
          for (c = 0; c < k; c += 1) m[c] = j(c, n) || 'null';
          g =
            m.length === 0
              ? '[]'
              : e
                ? '[\n' + e + m.join(',\n' + e) + '\n' + l + ']'
                : '[' + m.join(',') + ']';
          e = l;
          return g;
        }
        // 如果定义了额外的处理对象 h，处理对象的属性
        if (h && typeof h == 'object') {
          k = h.length;
          for (c = 0; c < k; c += 1) {
            d = h[c];
            if (typeof d == 'string') {
              g = j(d, n);
              g && m.push(i(d) + (e ? ': ' : ':') + g);
            }
          }
        } else
          // 处理普通对象的属性
          for (d in n)
            if (Object.hasOwnProperty.call(n, d)) {
              g = j(d, n);
              g && m.push(i(d) + (e ? ': ' : ':') + g);
            }
        g =
          m.length === 0
            ? '{}'
            : e
              ? '{\n' + e + m.join(',\n' + e) + '\n' + l + '}'
              : '{' + m.join(',') + '}';
        e = l;
        return g;
    }
  }

  // 定义字符串转义函数 i
  function i(a) {
    d.lastIndex = 0;
    return d.test(a)
      ? '"' +
          a.replace(d, function (a) {
            var b = g[a];
            return typeof b == 'string'
              ? b
              : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + a + '"';
  }

  // 定义日期格式化函数 b
  function b(a) {
    return a < 10 ? '0' + a : a;
  }

  // 如果 Date 对象没有 toJSON 方法，定义其 toJSON 方法
  if (typeof Date.prototype.toJSON != 'function') {
    Date.prototype.toJSON = function (a) {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            '-' +
            b(this.getUTCMonth() + 1) +
            '-' +
            b(this.getUTCDate()) +
            'T' +
            b(this.getUTCHours()) +
            ':' +
            b(this.getUTCMinutes()) +
            ':' +
            b(this.getUTCSeconds()) +
            'Z'
        : null;
    };
    String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON =
        function (a) {
          return this.valueOf();
        };
  }

  // 定义转义字符的正则表达式和变量
  var c =
      /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    d =
      /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    e,
    f,
    g = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    },
    h;

  // 初始化转义字符处理变量
  e = '';
  f = '\t';
  h = null;

  // 调用 j 函数开始转换 JSON 对象为字符串
  if (
    !b ||
    typeof b == 'function' ||
    (typeof b == 'object' && typeof b.length == 'number')
  ) {
    return j('', {
      '': a
    });
  }

  // 如果未能正确调用 j 函数，抛出错误
  throw new Error('JSON.stringify');
}
/**
 * 导出 JSON 文件
 * @param {string} file - Excel 文件路径
 * @param {string} outputPath - 导出路径
 * @param {function} cb - 回调函数，接收两个参数: (error, fileName)
 */
function exportJsonFile(file, outputPath, cb) {
  // 获取文件名（不含扩展名）
  var fileName = path.basename(file).split('.')[0];

  // 如果文件名以'~'开头，直接回调并返回
  if (fileName[0] == '~') {
    cb(true);
    return;
  }

  try {
    // 解析 Excel 文件
    var excel = xlsx.parse(file);

    // 如果 Excel 中没有工作表，则记录错误并回调
    if (excel.length <= 0) {
      log4js.error('worksheets.length <= 0 [ %s ][ %d ]', file, excel.length);
      cb(true);
      return;
    }

    // 遍历每个工作表
    for (var j = 0; j < excel.length; ++j) {
      var worksheets = excel[j];

      // 如果工作表数据少于等于1行，则记录错误并回调
      if (worksheets.data.length <= 1) {
        log4js.error(
          'worksheets.data.length <= 1 [ %s ][ %d ]',
          file,
          worksheets.data.length
        );
        log4js.error(JSON.stringify(worksheets));
        cb(true);
        return;
      }

      // 获取表头
      var header = [];
      var data = worksheets.data[0];

      // 如果表头数据少于等于1行，则记录错误并回调
      if (data.length <= 1) {
        log4js.error('header data.length <= 1 [ %s ][ %d ]', file, data.length);
        cb(true);
        return;
      }

      // 构建表头数组
      for (var i in data) {
        if (data[i]) {
          header.push(data[i]);
        }
      }

      // 构建注释对象
      var annotation = {};
      {
        var note = worksheets.data[1];

        // 如果注释数据少于等于1行，则记录错误并回调
        if (note.length <= 1) {
          log4js.error('body note.length <= 1 [ %s ][ %d ]', file, i);
          cb(true);
          return;
        }

        // 默认第一个字段为 key
        if (!note[0]) {
          log4js.error('annotation is NULL');
          cb(true);
          return;
        }

        // 将注释与表头对应起来
        for (var n = 0; n < header.length; ++n) {
          if (note[n]) {
            annotation[header[n]] = note[n];
          } else {
            annotation[header[n]] = '';
          }
        }
      }

      // 构建客户端和服务器导出的 JSON 对象
      var exportJson = {};
      var exportJson_server = {};

      // 遍历数据文件的每一行
      for (var i = 3; i < worksheets.data.length; ++i) {
        var data = worksheets.data[i];

        // 如果数据行少于等于1列，则记录信息并中断循环
        if (data.length <= 1) {
          log4js.info(
            '[%s]表中sheet[%d]有[%d]行空数据,被遗弃,请检查导出JSON数据是否正常！',
            file,
            j,
            i
          );
          break;
        }

        // 默认第一个字段为 key
        if (typeof data[0] == 'undefined') {
          continue;
        }

        // 如果第一个字段为 '#', 则跳过当前行
        if (data[0] == '#') continue;

        var key = data[0];
        var vtypes = worksheets.data[2];
        var valueType = '';
        var json = {};
        var json_sever = {};

        // 遍历数据列
        for (var n = 1; n < header.length; ++n) {
          if (typeof data[n] !== 'undefined') {
            valueType = vtypes[n];

            // 根据值类型转换数据格式
            if (valueType.startsWith('INT')) {
              data[n] = parseFloat(data[n].toFixed(0)); // 转换为整数
            } else if (valueType.startsWith('FLOAT')) {
              data[n] = parseFloat(data[n].toFixed(2)); // 转换为浮点数
            } else if (valueType.startsWith('STRING')) {
              // 字符串类型，暂无额外处理
            } else if (valueType.startsWith('LIST')) {
              data[n] = data[n].split(','); // 列表类型，按逗号分隔
            } else if (valueType.startsWith('MAP')) {
              // 映射类型，按指定格式处理
              let arr = data[n].split('_');
              let kv = '';
              let map = [];
              for (var j = 0; j < arr.length; ++j) {
                kv = arr[j].split(':');
                let cfg = {};
                cfg[kv[0]] = kv[1];
                map.push(cfg);
              }
              data[n] = map;
            }

            // 根据值类型存入不同的 JSON 对象
            if (valueType.endsWith('_C')) {
              json[header[n]] = data[n];
            } else if (valueType.endsWith('_S')) {
              json_sever[header[n]] = data[n];
            } else if (valueType != 'INVALID') {
              json[header[n]] = data[n];
              json_sever[header[n]] = data[n];
            }
          } else {
            // 如果数据为空，记录错误信息
            log4js.error(
              '[ %s ] 第[ %d ]行 第[ %d ] 列数值为空',
              file,
              i + 1,
              n + 1
            );
            json[header[n]] = '0'; // 设置默认值为 '0'
            json_sever[header[n]] = '0';
          }
        }

        // 将数据存入客户端和服务器 JSON 对象中
        exportJson['' + key] = json;
        exportJson_server['' + key] = json_sever;
      }

      // 创建客户端和服务器导出目录
      mkdirSync(outputPath + '/client');
      fs.writeFile(
        outputPath + '/client/' + worksheets.name + '.json',
        jsonToStr(exportJson),
        ['ANSI', 0666, 'w'],
        err => {}
      );
      console.log('jsonToStr', jsonToStr(exportJson));
      mkdirSync(outputPath + '/server');
      fs.writeFile(
        outputPath + '/server/' + worksheets.name + '.json',
        jsonToStr(exportJson_server),
        ['ANSI', 0666, 'w'],
        err => {}
      );
    }

    // 记录成功导出信息，并回调
    log4js.info('exportJsonFile[ %s ]', file);
    cb(false, fileName);
  } catch (e) {
    // 捕获异常，记录错误信息，并回调
    log4js.error(file);
    log4js.error(e);
    cb(true);
  }
}
/**
 * 删除文件夹及其内容
 * @param {string} path - 文件夹路径
 */
function delDir(path) {
  let files = [];
  // 检查路径是否存在
  if (fs.existsSync(path)) {
    // 读取文件夹内所有文件和子文件夹
    files = fs.readdirSync(path);
    // 遍历文件和子文件夹
    files.forEach((file, index) => {
      let curPath = path + '/' + file;
      // 如果是子文件夹，递归调用删除函数
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        // 如果是文件，直接删除
        fs.unlinkSync(curPath); //删除文件
      }
    });
    // 删除文件夹自身
    fs.rmdirSync(path);
  }
}

/*
 * 查找excel文件
 */
function findExcelFile() {
  // 输入的参数  输出地址 输入地址
  var inputPath = process.argv[2]; // ./table
  var outputPath = process.argv[3] + '/'; // ../Json/

  // 读 inputPath 目录下的所有excel文件
  var files = fs.readdirSync(inputPath);
  var excelFiles = [];
  for (var i in files) {
    var file = inputPath + '/' + files[i];
    var fileName = path.basename(file);
    // 判断是否为xlsx文件且文件名不以"."开头
    if (path.extname(file) == '.xlsx' && fileName[0] != '.') {
      excelFiles.push(file); // 符合条件的文件加入excelFiles数组
    }
  }

  // 删除 output 目录下的所有文件
  delDir(outputPath);

  var len = excelFiles.length; // excel文件的数量
  var count = 0;

  async.whilst(
    function () {
      return count < len;
    },
    function (cb) {
      // 对每个excel文件调用exportJsonFile函数进行处理
      exportJsonFile(excelFiles[count], outputPath, function (error, fileName) {
        count++;
        cb();
      });
    },
    function (err) {
      // 处理完所有文件后的回调函数（此处为空）
    }
  );
}

// 调用查找excel文件的函数
findExcelFile();
