import { Socket } from 'dgram';
import todoService from '../service/todoService.js';
import BaseController from './baseController.js';

class TodoController extends BaseController {
  async create(ctx) {
    const { body } = ctx.request;
    await todoService.create(body);
    this.success(ctx);
  }
  /**
   * 获取代办列表接口
   */
  async findAll(ctx) {
    const { pageIndex, pageSize } = ctx.request.query;
    const [list, total] = await todoService.findAll(pageIndex, pageSize);
    this.success(ctx, { list, total });
  }
}
export default new TodoController();
