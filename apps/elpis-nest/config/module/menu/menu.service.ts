// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Menu } from './menu.entity';

// @Injectable()
// export class MenuService {
//   constructor(
//     @InjectRepository(Menu)
//     private readonly menuRepository: Repository<Menu>,
//   ) {}

//   findAll() {
//     const sql = 'select * from menu order by id asc';
//     return this.menuRepository.query(sql);
//   }

//   findActive() {
//     const sql = 'select * from menu where active = 1 order by id asc';
//     return this.menuRepository.query(sql);
//   }

//   create(body) {
//     return this.menuRepository.save(body.data || body);
//   }

//   update(body) {
//     const id = body?.data?.id || body.id;
//     const data = body.data || body;
//     return this.menuRepository.update(id, data);
//   }
// }
