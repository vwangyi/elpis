import config from '../../config/index.js';
import mysql2 from 'mysql2/promise'; // 使用 promise 版本 npm i mysql2
import nodemailer from 'nodemailer';

export default class BaseService {
  constructor() {
    this.mysql2 = mysql2.createPool(config.MYSQL2);
    this.email = nodemailer.createTransport(config.EMAIL);
    this.config = config;
  }
}
