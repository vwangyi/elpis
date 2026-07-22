const assert = require('assert');
const supertest = require('supertest');
const md5 = require('md5');
const elpisCore = require('../../elpis-core');
const signKey = 'klx05hb3n1c9ujp8uhx4bs2ikk5io6wp212';
const st = Date.now();

describe('测试 project 相关接口', function () {
  this.timeout(600000);

  let modelList;
  const projectList = [];
  let request;

  it('启动服务', async () => {
    const app = await elpisCore.start();
    modelList = require('../../model/index.js')(app);
    modelList.forEach(item => {
      const { project } = item;
      for (const pKey in project) {
        projectList.push(project[pKey]);
      }
    });
    request = supertest(app.listen());
  });

  /**
   * 当 /api/project接口 如果没有传 proj_key
   * res.body.success 应该是 false
   * res.body.code 应该是 442
   * res.body.message 应该包含 request validate fail: 这句话
   */
  it('GET /api/project without proj_key', async () => {
    let tmpRequest = request.get('/api/project');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    const res = await tmpRequest;
    assert(res.body.success === false);
    const resBody = res.body;
    assert(resBody.code === 442);
    assert(resBody.message.indexOf(`request validate fail:`) > -1);
  });

  /**
   * 当 /api/project接口 fail失败情况
   * res.body.success 应该是 false
   * res.body.code 应该是 50000
   * res.body.message 应该是 获取项目异常
   */
  it('GET /api/project fail', async () => {
    let tmpRequest = request.get('/api/project');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    tmpRequest = tmpRequest.query({
      proj_key: 'xxxxxxxxxxxxx'
    });
    const res = await tmpRequest;

    assert(res.body.success === false);
    const resBody = res.body;
    assert(resBody.code === 50000);
    assert(resBody.message === '获取项目异常');
  });

  /**
   * 当 /api/project接口 传了 正确的proj_key 应该是成功情况
   * res.body.success 应该是 false
   * res.body.code 应该是 50000
   * res.body.message 应该是 获取项目异常
   */
  it('GET /api/project with proj_key', async () => {
    const checkModule = menuItem => {
      const { moduleType } = menuItem;
      assert(moduleType);

      if (moduleType === 'side') {
        const { sideConfig } = menuItem;
        assert(sideConfig);
        assert(sideConfig.menu);
        sideConfig.menu.forEach(sideMenuItem => {
          checkMenuItem(sideMenuItem);
        });
      }
      if (moduleType === 'iframe') {
        const { iframeConfig } = menuItem;
        assert(iframeConfig);
        assert(iframeConfig.path !== void 0);
      }
      if (moduleType === 'custom') {
        const { customConfig } = menuItem;
        assert(customConfig);
        assert(customConfig.path !== void 0);
      }
      if (moduleType === 'schema') {
        const { schemaConfig } = menuItem;
        assert(schemaConfig);
        assert(schemaConfig.path !== void 0);
      }
    };

    const checkMenuItem = menuItem => {
      console.log('--------', menuItem.key);
      assert(menuItem.key);
      assert(menuItem.name);
      assert(menuItem.menuType);

      if (menuItem.menuType === 'group') {
        assert(menuItem.subMenu !== void 0);
        menuItem.subMenu.forEach(item => {
          checkMenuItem(item);
        });
      }
      if (menuItem.menuType === 'module') {
        checkModule(menuItem);
      }
    };

    for (let i = 0; i < projectList.length; ++i) {
      // const index = Math.floor(Math.random() * projectList.length); // 一个随机下标
      const { key: projKey } = projectList[i];
      let tmpRequest = request.get('/api/project');
      tmpRequest = tmpRequest.set('s_t', st);
      tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
      tmpRequest = tmpRequest.query({
        proj_key: projKey
      });
      const res = await tmpRequest;
      assert(res.body.success === true);
      const resData = res.body.data;

      assert(resData.key === projKey);
      assert(resData.modelKey);
      assert(resData.name);
      assert(resData.desc !== void 0);
      assert(resData.home !== void 0);

      const { menu } = resData;
      menu.forEach(item => {
        checkMenuItem(item);
      });
    }
  });

  it('GET /api/project/list without proj_key', async () => {
    let tmpRequest = request.get('/api/project/list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    const res = await tmpRequest;

    // 断言 res.body.success 应该是为true 否则就报错
    assert(res.body.success === true);

    const list = res.body.data;
    // 断言 返回的数据长度 应该和 projectList的长度是一样的 否则就报错
    assert(list.length === projectList.length);

    for (let i = 0; i < list.length; ++i) {
      const item = list[i];
      // 断言item.modelKey 应该存在 否则报错
      assert(item.modelKey);
      assert(item.key);
      assert(item.name);
      // 断言item.desc 不应该是undefined  否则报错
      assert(item.desc !== undefined);
      assert(item.home !== undefined);
    }
  });
  it('GET /api/project/list with proj_key', async () => {
    const index = Math.floor(Math.random() * projectList.length); // 一个随机下标
    const { key: projKey } = projectList[index];
    const { modelKey } = projectList.find(item => item.key === projKey);

    let tmpRequest = request.get('/api/project/list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    tmpRequest = tmpRequest.query({
      proj_key: projKey
    });
    const res = await tmpRequest;

    // 断言 res.body.success 应该是为true 否则就报错
    assert(res.body.success === true);

    const list = res.body.data;
    // 断言 返回的数据长度 应该和 projectList里面的modelKey的长度是一样的 否则就报错
    assert(
      list.length ===
        projectList.filter(item => item.modelKey === modelKey).length
    );

    for (let i = 0; i < list.length; ++i) {
      const item = list[i];
      // 断言item.modelKey 应该存在 否则报错
      assert(item.modelKey);
      assert(item.key);
      assert(item.name);
      // 断言item.desc 不应该是undefined  否则报错
      assert(item.desc !== undefined);
      assert(item.home !== undefined);
    }
  });

  it('GET /api/project/model/list', async () => {
    let tmpRequest = request.get('/api/project/model/list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    const res = await tmpRequest;

    assert(res.body.success === true); // 相当于 if (res.body.success === true) 不满足就报错

    const list = res.body.data;

    assert(list.length > 0);

    for (let i = 0, len = list.length; i < len; ++i) {
      const item = list[i];
      assert(item.model);
      assert(item.model.key);
      assert(item.model.name);
      assert(item.project);

      for (const key in item.project) {
        assert(item.project[key].key);
        assert(item.project[key].name);
      }
    }
  });
});
