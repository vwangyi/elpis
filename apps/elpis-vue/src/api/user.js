import request from '@/utils/request';

/**
 * 获取用户列表
 * @param {*} condition
 * @returns
 */
export function findAll(condition = {}) {
  return request.get('/api/user/list', condition);
}

/**
 * 获取当前登录用户信息
 * @returns
 */
export function findUserInfo() {
  return request.get('/api/user/info');
}
