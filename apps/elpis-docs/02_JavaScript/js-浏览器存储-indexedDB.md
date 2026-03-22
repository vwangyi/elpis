# indexedDB 


基础概念
● 数据库（Database） ：IndexedDB 的顶层容器，每个数据库有唯一名称和版本号，版本号升级时会触发 onupgradeneeded 事件。
● 对象仓库（Object Store） ：类似关系型数据库的“表”，用于存储结构化数据，每个对象仓库有唯一主键（keyPath）。
● 事务（Transaction） ：所有数据操作（增删查改）必须通过事务执行，支持 readonly（只读）和 readwrite（读写）两种模式，确保数据一致性。
● 索引（Index） ：基于对象仓库的某个属性创建，用于快速查询数据（类似数据库索引），支持唯一索引（unique: true）和非唯一索引。
● 主键（KeyPath） ：对象仓库中每条数据的唯一标识，可手动指定（如 deviceId）或自动生成（autoIncrement: true）。
● 游标（Cursor） ：用于遍历对象仓库中的数据，支持条件筛选、排序等复杂查询（基础用法中未提及，下文补充）。
● 版本号管理：数据库版本号必须为正整数，升级后无法回退，修改表结构时需递增版本号。
● 事务生命周期：事务会在操作完成后自动提交，若长时间不操作（如超过 5 秒）会被浏览器终止。
  ○ 也就是说 当对表进行事务操作（比如 增删改查）操作完成后 会自动关闭事务 不需要程序员手动关闭事务，


  ● 错误处理：所有操作都需捕获错误（如主键重复、权限不足、存储满），避免影响页面正常运行。
● 性能优化：
  ○  批量操作时尽量合并为一个事务，减少事务创建次数。
  ○ 大量数据查询使用游标（Cursor），避免使用 getAll() 导致内存占用过高。(尽量用分页查询 而不是全量查询）
  ○ 合理创建索引，提升查询效率，但避免过多索引（会影响新增/修改性能）。
● 数据序列化：虽然 IndexedDB 支持存储对象，但复杂对象（如函数、循环引用对象）无法存储，需提前序列化（如 JSON.stringify）。
● 浏览器兼容性：主流浏览器（Chrome、Firefox、Edge、Safari 10.1+）均支持 IndexedDB，如需兼容旧浏览器（如 IE9-），需使用 localForage 等兼容库。
● 安全限制：IndexedDB 受同源策略限制，不同域名无法访问彼此的数据库；本地文件（file:// 协议）无法使用 IndexedDB，需通过服务器（http:///https://）访问。


```js

  const transaction = db.transaction('myStore', 'readwrite');
  const store = transaction.objectStore('myStore');

  const request = store.put({ id: 1, value: 'data' });
  // 没有为 request 设置 onsuccess/onerror 回调！
  // 事务将一直等待这个请求的“完成”信号，直到超时（约5秒）后失败回滚。

  // 添加一个异步操作
  setTimeout(() => {
    // 此操作必定失败，因为事务早已结束
    store.put({ id: 2, value: 'too late' }); 
  }, 1000);
```