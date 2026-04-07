/* category表 分类模块 */
module.exports = app => {
  const BaseService =
    require('./BaseService')(
      app
    );

  return class CategoryService extends BaseService {
    /* 获取列表（分页） */
    async getUserList() {}

    /* 获取详情（列表某一个的详情） */
    getUserDetail(linkId) {}

    /* 删除某一个 */
    remove(linkIds) {}

    /* 改某一个 */
    update() {}

    /* 新增一个 */
    create() {}

    /**
     *
     */
    // get(projKey) {
    //     let projConfig;

    //     modelList.forEach(modelItem => {
    //         if (modelItem.project[projKey]) {
    //             projConfig = modelItem.project[projKey];
    //         }
    //     });
    //     return projConfig

    // }
    // getList({ projKey }) {
    //     return modelList.reduce((result, modelItem) => {
    //         const { project } = modelItem;

    //         // 如果没有projKey 就获取所有
    //         if (projKey && !project[projKey]) {
    //             return result;
    //         }
    //         // 如果有projKey 就获取指定的
    //         for (const pKey in project) {
    //             result.push(project[pKey]);
    //         }
    //         return result;
    //     }, []);
    // }
    // /**
    //  * 获取所有模型与项目的结构化数据
    //  * @param {object} ctx 上下文
    //  */
    // async getModelList(ctx) {
    //     /**
    //      * 正常来说 这里是 读取 硬盘上的 数据库或文件
    //      * 目前只是模拟 返回数据
    //      */
    //     return modelList;
    // }
  };
};
