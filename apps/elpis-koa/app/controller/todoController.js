import { Socket } from 'dgram';
import todoService from '../service/todoService.js';
import BaseController from './baseController.js';

class TodoController extends BaseController {
  /**
   * 获取代办列表接口
   */
  async getTodoList(ctx, next) {
    // console.log('ctx', ctx.request.method);
    // console.log('ctx', ctx.request.url);
    // console.log('request', ctx.request.header);
    // console.log('ctx', ctx.response);
    // console.log('ctx', ctx.app);
    // console.log('ctx', ctx.req);
    // console.log('ctx', ctx.res);
    // console.log('ctx', ctx.socket);
    console.log('ctx.query', ctx.query);
    console.log('ctx', Object.keys(ctx));

    const { query, params, header, body } = ctx.request;
    console.log(' ctx.request', query, params, header, body);

    ctx.body = {};

    // 接受数据
    // const page = ctx;
    // const limit = ctx;
    // const { list, total } = await todoService.getTodoList(page, limit);
    // 响应回去
    // this.success();
  }
}
export default new TodoController();
