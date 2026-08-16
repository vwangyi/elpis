import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  @InjectRepository(Todo)
  private readonly todoRepository: Repository<Todo>;

  // 新增待办
  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(todo);
  }

  // 删除待办
  async remove(id: number) {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
    return { message: `待办 #${id} 删除成功` };
  }

  // 更新待办
  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }

  // 查询单个待办
  async findOne(id: number) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`待办 #${id} 不存在`);
    }
    return todo;
  }

  // 查询待办列表
  // 支持按标题模糊搜索、按状态筛选；传入 page/pageSize 时返回分页结构，否则返回全部
  async findAll(
    title?: string,
    status?: number,
    page?: number,
    pageSize?: number
  ) {
    const where: Record<string, unknown> = {};
    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (status !== undefined && status !== null) {
      where.status = status;
    }

    // 未传分页参数：返回全部数据（兼容原有行为）
    if (
      page === undefined ||
      page === null ||
      pageSize === undefined ||
      pageSize === null
    ) {
      return await this.todoRepository.find({
        where,
        order: { createTime: 'DESC' }
      });
    }

    // 传了分页参数：返回分页结构 { list, total, page, pageSize }
    const [list, total] = await this.todoRepository.findAndCount({
      where,
      order: { createTime: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return { list, total, page, pageSize };
  }
}
