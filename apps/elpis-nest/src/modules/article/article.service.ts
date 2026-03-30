import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article' + JSON.stringify(createArticleDto);
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article ${JSON.stringify(updateArticleDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
