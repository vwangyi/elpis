/**
 * 封装一个工具类 用来操作 indexedDB
 */
export default class IndexedDB {
  name = 'elpis'; // 数据库名
  version = 5; // 数据库版本

  db = null; // 连接浏览器的indexedDB数据库实例

  constructor(name, version) {
    this.name = name || this.name;
    this.version = version || this.version;
    //   const that = this;
    //   // init是一个异步操作 但constructor里面不能使用await
    //   // 所以 当用户在异步回来之前操作增删改查是不行的 只能提示用户正在初始化请稍后
    //   this.#init(this.name, this.version).then((db) => that.db = db)
  }

  /**
   * 关闭数据库连接
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * 创建一张表
   * @param {*} db 数据库
   * @param {*} table 表名
   * @param {*} option 选项
   */
  #createTable(
    db,
    table, // 设置id为主键 主键应该唯一
    // 如果autoIncrement为false 表示不自增 那么插入的对象里面必须有keyPath ,
    // 如果autoIncrement为true 表示自增 那么插入的对象里面会自动存在keyPath 且是自增的
    option = { keyPath: 'key', autoIncrement: false }
  ) {
    // 不存在表就创建
    if (!db.objectStoreNames.contains(table)) {
      return db.createObjectStore(table, option);
    }
  }

  #init(name, version) {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB;
      if (!indexedDB) {
        return reject();
      }
      const res = indexedDB.open(name, version);
      // onupgradeneeded升级数据库就触发 比如 新建表。
      // 错误例子：比如 表里面新增一条数据 不叫数据库更新 最多叫表更新了
      res.onupgradeneeded = event => {
        const db = event.target.result;

        // 创建note笔记表
        this.#createTable(db, 'note', { keyPath: 'key', autoIncrement: false });
        // 创建draft草稿表
        this.#createTable(db, 'draft', {
          keyPath: 'key',
          autoIncrement: false
        });
      };
      res.onerror = reject;
      res.onsuccess = e => resolve(e.target.result);
    });
  }

  /* 增：给表新增一条数据 */
  async create(table, data) {
    if (!this.db) {
      this.db = await this.#init(this.name, this.version);
    }
    data = { ...data, key: crypto.randomUUID().replace(/-/g, '') };
    return new Promise(async (resolve, reject) => {
      // 开启读写事务
      const res = this.db.transaction(table, 'readwrite').objectStore(table).add(data);
      res.onerror = reject; // 事务失败
      res.onsuccess = resolve; // 事务成功
    });
  }

  /* 删：给表删除一条数据 */
  async remove(table, key) {
    if (!this.db) {
      this.db = await this.#init(this.name, this.version);
    }
    // 根据主键删除
    return new Promise(async (resolve, reject) => {
      // 开启读写事务
      const res = this.db.transaction(table, 'readwrite').objectStore(table).delete(key);
      res.onerror = reject; // 事务失败
      res.onsuccess = resolve; // 事务成功
    });
  }

  /* 改:  */
  async update(table, data) {
    if (!this.db) {
      this.db = await this.#init(this.name, this.version);
    }
    data = { ...data, key: crypto.randomUUID().replace(/-/g, '') };
    return new Promise(async (resolve, reject) => {
      try {
        // 开启读写事务
        const res = this.db.transaction(table, 'readwrite').objectStore(table).put(data);
        res.onerror = reject; // 事务失败
        res.onsuccess = resolve; // 事务成功
      } catch (err) {
        reject(err);
      }
    });
  }
  /* 查：根据主键查询 */
  async findOne(table, id) {
    if (!this.db) {
      this.db = await this.#init(this.name, this.version);
    }
    return new Promise(async (resolve, reject) => {
      try {
        // 开启读写事务
        const res = this.db.transaction(table, 'readwrite').objectStore(table).get(id); // get方法接收主键
        res.onerror = reject; // 事务失败
        res.onsuccess = resolve; // 事务成功
      } catch (err) {
        reject(err);
      }
    });
  }

  /* 查：全量查询 一般不用 */
  async findAll(table) {
    if (!this.db) {
      this.db = await this.#init(this.name, this.version);
    }
    return new Promise(async (resolve, reject) => {
      try {
        // 开启读写事务
        const res = this.db.transaction(table, 'readwrite').objectStore(table).getAll();
        res.onerror = reject; // 事务失败
        res.onsuccess = resolve; // 事务成功
      } catch (err) {
        reject(err);
      }
    });
  }

  //  索引查询  request = objectStore.index(indexName).get(indexValue);
  // 游标查询（支持筛选）
  //  request = objectStore.openCursor();
  //           const result = [];

  //           request.onsuccess = (event) => {
  //             const cursor = event.target.result;
  //             if (cursor) {
  //               if (cursorFilter(cursor.value)) {
  //                 result.push(cursor.value);
  //               }
  //               cursor.continue();
  //             } else {
  //               resolve(result);
  //             }
  //   };
}
