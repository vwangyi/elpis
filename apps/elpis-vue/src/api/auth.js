import request from '@/utils/request';

export function login() {
  return request.get('/auth/login');
}

export function logout() {
  return request.get('/auth/logout');
}

/* 发送邮箱验证码 */
export function sendEmailCode(email) {
  return request.get('/api/auth/send_email_code', {
    query: { email }
  });
}

/* 登录 通过邮箱+验证码 */
export function loginByEmailAndCode({ email, code }) {
  return request.post('/api/auth/login/by_email_code', {
    data: { email, code }
  });
}

/* 通过邮箱+密码登录 */
export function loginByEmailAndPassword({ email, password }) {
  return request.post('/xx/', { query: { email, password } });
}
