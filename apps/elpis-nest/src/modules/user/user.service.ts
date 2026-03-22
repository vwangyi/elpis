/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
// import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /* 增加一个 */
  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username || '';
    user.password = createUserDto.password;
    user.nickname = createUserDto.nickname || createUserDto.username;
    user.role = createUserDto.role;
    user.avatar = createUserDto.avatar;
    user.active = 1;

    const { username, password, nickname, role, avatar } = createUserDto;

    const sql = `insert into user('username', 'password', 'nickname', 'role', 'avatar') 
      valus(${username}, ${password}, ${nickname}, ${role}, ${avatar})
    `;
    return this.usersRepository.save(user);
    return this.usersRepository.query(sql);
  }
  /* 删除一个 */
  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
  /* 根据username查询user对象 */
  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username }) as Promise<User>;
  }
  /* 查询一个 */
  async findOne(id: number): Promise<User> {
    const sql = `select * from t_user where id = ${id}`;
    const result = await this.usersRepository.query(sql);
    return result;
    // return this.usersRepository.findOneBy({ id });
  }

  findOneByToken() {}

  /* 查询所有 */ /* 这是demo写法 实际场景都是很多的需要分页 写法 除非你能保证数据很少 才可以不分页  */

  /* 查询所有 不分页情况 */
  findAll(query: any): Promise<User[]> {
    console.log('@@ query');
    console.log(query);
    let where = 'WHERE 1=1';
    if (query.id) {
      where += ` AND id='${query.id}'`;
    }
    if (query.username) {
      where += ` AND username='${query.username}'`;
    }
    if (query.active) {
      where += ` AND active='${query.active}'`;
    }
    let page = +query.page || 1;
    let pageSize = +query.pageSize || 20;
    if (page <= 0) {
      page = 1;
    }
    if (pageSize <= 0) {
      pageSize = 20;
    }
    const sql = `
      select id, username, avatar, role, nickname from t_user
      where ${where}
      limit ${pageSize}
      offset ${(page - 1) * pageSize}
    `;
    return this.usersRepository.query(sql);
  }

  /**
   * 获取用户列表（带分页）
   */
  async getUserList(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;

    // 查询总数
    // const countSql = `SELECT COUNT(*) as total FROM user WHERE active = true`;
    const countSql = `SELECT COUNT(*) as total FROM user;`;
    const countResult = await this.usersRepository.query(countSql);

    const total = parseInt(countResult[0].total);

    // 查询分页数据（不返回 password 字段）
    const dataSql = `SELECT id, username, avatar, role, nickname, active FROM user  
      ORDER BY id ASC 
      LIMIT ? OFFSET ?
    `;

    const data = await this.usersRepository.query(dataSql, [pageSize, skip]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  getUserList1(params) {
    // 当前页码page默认为1
    const page = +params.page >= 1 ? +params.page : 1;
    // 每页条数pageSize默认为20
    const pageSize = +params.pageSize >= 1 ? +params.pageSize : 20;

    const { title = '', author = '' } = params;

    let where = 'where 1=1';
    if (title) {
      where += ` AND title LIKE '%${title}%'`;
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`;
    }
    const sql = `select * from user ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`;
    return this.usersRepository.query(sql);
  }
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

  //   findByUsername(username: string): Promise<User> {
  //     return this.usersRepository.findOneBy({ username });
  //   }
}
