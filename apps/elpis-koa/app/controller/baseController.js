class BaseController {
  /**
   * controller 基类
   * 统一书写 controller 相关的公共方法
   */
  constructor() {}

  /**
   * 处理接口成功情况  响应给前端的数据结构
   * @params { object } ctx 上下文
   * @params { object } data 核心数据
   * @params { object } metadata 附加数据
   */
  success(ctx, data = {}, message = '操作成功') {
    ctx.status = 200;
    ctx.body = {
      success: true,
      data,
      message
    };
  }

  /**
   * 处理接口失败情况  响应给前端的数据结构
   * @params { Object } ctx 上下文
   * @params { object } message 错误信息
   * @params { object } code 错误码
   */
  fail(ctx, code, message = '操作失败') {
    ctx.body = {
      code,
      success: false,
      data: null,
      message
    };
  }
}
