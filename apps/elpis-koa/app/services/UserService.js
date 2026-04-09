/* user表 用户模块 */
module.exports = app => {
  const BaseService = require('./BaseService')(app);
  const jwt = require('jsonwebtoken');
  const moment = require('moment');
  const { v4: uuidv4 } = require('uuid');
  const generator = require('generate-password');

  return class UserService extends BaseService {
    /* 增 */
    async create({ username, nickname, desc, sex }) {
      const userId = (global?.crypto?.randomUUID() || uuidv4())?.replace(
        /-/g,
        ''
      );
      const password = generator.generate({
        length: 8,
        numbers: true
      });

      await app.knex('user').insert({
        user_id: userId,
        username,
        password,
        nickname,
        desc,
        sex,
        isDelete: 1,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      return userId;
    }

    /* 删 */
    async remove(userId) {
      await app
        .knex('user')
        .update({
          isDelete: 0,
          update_time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .where({
          user_id: userId
        });
    }

    /* 改 */
    async update(userId, params) {
      const { nickname, username, desc, gender } = params;
      const tmp = {};
      if (nickname) tmp.nickname = nickname;
      if (username) tmp.username = username;
      if (desc) tmp.desc = desc;
      if (gender) tmp.gender = gender;

      await app
        .knex('user')
        .update({
          ...tmp,
          update_time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .where({
          user_id: userId
        });
    }

    /* 查列表 */
    async findAll(condition) {
      // 默认值处理
      condition.page = Number(condition.page) >= 1 ? Number(condition.page) : 1;
      condition.size =
        Number(condition.size) >= 1 ? Number(condition.size) : 10;

      const {
        username,
        nickname,
        sex,
        createTimeStart,
        createTimeEnd,
        page,
        size
      } = condition;

      const query = {};
      if (username) query.username = username;
      if (nickname) query.nickname = nickname;
      if (sex) query.sex = sex;

      let sql = app.knex('user').select('*').where(query);

      const offset = (page - 1) * size;
      sql = sql.limit(size).offset(offset);

      return await sql;
    }

    /* 查总数 */
    async findTotal(condition) {
      const { username, nickname, sex, createTimeStart, createTimeEnd } =
        condition;
      const query = {};
      if (username) query.username = username;
      if (nickname) query.nickname = nickname;
      if (sex) query.sex = sex;
      // select count(distinct `user_id`) as `user_amount` from `user`
      let sql = app
        .knex('user')
        .countDistinct('user_id as user_amount')
        .where(query);

      if (createTimeStart) {
        sql = sql.andWhere('create_time', '>=', createTimeStart);
      }
      if (createTimeEnd) {
        sql = sql.andWhere('create_time', '<', createTimeEnd);
      }
      const [{ user_amount }] = await sql;
      return user_amount;
    }

    /* 查详情 通过userId */
    async findOneByUserId(userId) {
      const result = await app.knex('user').select('*').where({
        user_id: userId,
        isDelete: 1
      });
      return result[0] ?? {};
    }

    /* 查详情 通过用户名和密码 */
    async findOneByUsernameAndPassword({ username, password }) {
      const sql = `select * from user where username=${username} password=${password} isDelete=1`;
      // const res = await app.knex.raw(sql)
      const res = await app
        .knex('user')
        .select('*')
        .where({
          username,
          password,
          isDelete: 1
        })
        .limit(1); // 限制查一条
      return res[0];
    }

    /* 通过邮箱查找用户 */
    async findByEmail(email) {
      const result = await app.knex('user').select('*').where({
        email,
        isDelete: 1
      });
      return result[0] ?? null;
    }

    /* 通过邮箱创建用户 */
    async createByEmail(email) {
      const userId = (global?.crypto?.randomUUID() || uuidv4())?.replace(
        /-/g,
        ''
      );
      const password = generator.generate({
        length: 8,
        numbers: true
      });

      await app.knex('user').insert({
        user_id: userId,
        email,
        isDelete: 1,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      return userId;
    }
  };
};
