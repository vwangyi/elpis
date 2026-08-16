import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
  UseInterceptors
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TransformInterceptor } from './todo.interceptor';

@Controller('todo')
@UseInterceptors(TransformInterceptor)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 新增待办
  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  // 查询待办列表（支持按标题模糊搜索、按状态筛选、可选分页）
  // 分页示例: GET /todo?page=1&pageSize=10
  @Get()
  findAll(
    @Query('title') title?: string,
    @Query('status') status?: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ) {
    return this.todoService.findAll(title, status, page, pageSize);
  }

  // 查询单个待办
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  // 更新待办
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTodoDto: UpdateTodoDto
  ) {
    return this.todoService.update(+id, updateTodoDto);
  }

  // 删除待办
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
