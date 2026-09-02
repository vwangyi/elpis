import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  @InjectRepository(Chat)
  private readonly chatRepository: Repository<Chat>;

  // 新增一条聊天消息（持久化）
  async create(createChatDto: CreateChatDto) {
    const chat = this.chatRepository.create({
      room: createChatDto.room || 'public',
      username: createChatDto.username,
      content: createChatDto.content
    });
    return await this.chatRepository.save(chat);
  }

  // 查询某个房间的历史消息（分页，按时间正序返回，方便前端直接渲染）
  async findHistory(room = 'public', page = 1, pageSize = 50) {
    const [list, total] = await this.chatRepository.findAndCount({
      where: { room },
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    // 数据库倒序取最新一页，反转后按时间正序返回
    return { list: list.reverse(), total, page, pageSize };
  }

  // 查询所有消息（调试用）
  async findAll() {
    return await this.chatRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    return await this.chatRepository.findOneBy({ id });
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const chat = await this.findOne(id);
    if (chat) {
      Object.assign(chat, updateChatDto);
      return await this.chatRepository.save(chat);
    }
    return null;
  }

  async remove(id: number) {
    const chat = await this.findOne(id);
    if (chat) {
      await this.chatRepository.remove(chat);
      return { message: `消息 #${id} 删除成功` };
    }
    return null;
  }
}
