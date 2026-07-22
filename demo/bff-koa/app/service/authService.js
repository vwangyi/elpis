import BaseService from './baseService.js';
/* Auth模块 */
class AuthService extends BaseService {
  /**
   * 发送邮箱验证码
   * sendEmailCode({
   *   email: '', 给谁发
   *   code: '', 验证码是什么
   *   expiresAt: '', // 过期时间 单位毫秒
   * })
   */
  async sendEmailCode({ email, code, expiresAt }) {
    const result = await this.email.sendMail({
      from: {
        name: 'WANGYI', // 显示的发件人名称
        address: this.config.EMAIL.auth.user // 发件人
      },
      to: email, // 收件人
      subject: '验证码', // 主题
      text: `您的验证码是：${code}，该验证码${expiresAt / 1000 / 60}分钟内有效。` // 纯文本内容（备用）
    });
    return result;
  }
}

export default new AuthService();
