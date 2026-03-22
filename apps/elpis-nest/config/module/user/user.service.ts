// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './user.entity';
// import { CreateUserDto } from './user.dto';
// import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly usersRepository: Repository<User>,
//   ) {}

//   /* 增加一个 */
//   create(createUserDto: CreateUserDto): Promise<User> {
//     const user = new User();
//     user.username = createUserDto.username;
//     user.password = createUserDto.password;
//     user.nickname = createUserDto.nickname || createUserDto.username;
//     user.role = createUserDto.role;
//     user.avatar = createUserDto.avatar;
//     user.active = 1;

//     const {
//        username,
//        password,
//        nickname,
//        role,
//        avatar
//     } = createUserDto;

//     const sql = `insert into
//       t_user('username', 'password', 'nickname', 'role', 'avatar')
//       valus(${username}, ${password}, ${nickname}, ${role}, ${avatar})
//     `;
//     return this.usersRepository.query(sql);
//     // return this.usersRepository.save(user);
//   }
//   /* 删除一个 */
//   remove(id: number): Promise<DeleteResult> {
//     return this.usersRepository.delete(id);
//   }
//   /* 修改一个 */
//   update(params) {
//     const { username, nickname, active, role } = params;
//     const setSql = [];
//     if (nickname) {
//       setSql.push(`nickname="${nickname}"`);
//     }
//     if (active) {
//       setSql.push(`active="${active}"`);
//     }
//     if (role) {
//       setSql.push(`role=${JSON.stringify(role)}`);
//     }
//     const updateSql = `UPDATE admin_user SET ${setSql.join(',')} WHERE username="${username}"`;
//     return this.usersRepository.query(updateSql);
//   }

//   /* 查询一个 */
//   async find(id: number): Promise<User> {
//     const sql = `select * from t_user where id = ${id}`;
//     const result = await this.usersRepository.query(sql);
//     console.log('@@ result', result);
//     return result;
//     // return this.usersRepository.findOneBy({ id });
//   }

//   /* 查询所有 */ /* 这是demo写法 实际场景都是很多的需要分页 写法 除非你能保证数据很少 才可以不分页  */
//   findAll(query: any): Promise<User[]> {
//     console.log('@@ query');
//     console.log(query);
//     let where = 'WHERE 1=1';
//     if (query.id) {
//       where += ` AND id='${query.id}'`;
//     }
//     if (query.username) {
//       where += ` AND username='${query.username}'`;
//     }
//     if (query.active) {
//       where += ` AND active='${query.active}'`;
//     }
//     let page = +query.page || 1;
//     let pageSize = +query.pageSize || 20;
//     if (page <= 0) {
//       page = 1;
//     }
//     if (pageSize <= 0) {
//       pageSize = 20;
//     }
//     const sql = `
//       select id, username, avatar, role, nickname from t_user
//       where ${where}
//       limit ${pageSize}
//       offset ${(page - 1) * pageSize}
//     `;
//     // 使用 query 方法 可以直接 执行 sql语句
//     return this.usersRepository.query(sql);
//   }

// }
