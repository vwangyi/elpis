module.exports = app => {
  // 存储验证码（生产环境建议使用 Redis）
  const verificationCodes = new Map();
  const BaseService = require('./BaseService')(app);
  return class EmailService extends BaseService {
    /* 验证邮箱验证码 */
    async verifyEmailCode({ email, code }) {
      if (!email || !code) {
        return Promise.reject('验证码和邮箱不能为空');
      }
      const storedData = verificationCodes.get(email);
      if (!storedData) {
        return Promise.reject('验证码不存在或已过期');
      }
      // 检查是否过期
      if (Date.now() > storedData.expiresAt) {
        verificationCodes.delete(email);
        return Promise.reject('验证码已过期');
      }
      // 验证码是否正确
      if (storedData.code !== code) {
        return Promise.reject('验证码错误');
      }
      // 验证成功，删除验证码
      verificationCodes.delete(email);
    }

    // 发送验证码邮件
    async sendVerificationCode({ email, code, expiresAt }) {
      const { email: emailConfig } = app.config;

      console.log(' email Service 发送验证码到邮箱:', email, '验证码:', code);
      const info = await app.email.sendMail({
        from: {
          name: 'WANGYI', // 显示的发件人名称
          address: emailConfig.auth.user // 必须和上面auth.user一致
        },
        to: email,
        subject: '验证码', // 主题
        text: `您的验证码是：${code}，该验证码5分钟内有效。`, // 纯文本内容（备用）
        html: ` 
          <div
            style="
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            "
          >
            <div style="text-align: center; margin-bottom: 30px">
              <h1 style="color: #2c3e50">邮箱验证码</h1>
            </div>

            <div
              style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              "
            >
              <p style="color: #555; line-height: 1.6; font-size: 16px">
                尊敬的用户，您好！
              </p>
              <p style="color: #555; line-height: 1.6; font-size: 16px">
                您的验证码为：
              </p>

              <div style="text-align: center; margin: 40px 0">
                <div
                  style="
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px 40px;
                    border-radius: 8px;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 5px;
                  "
                >
                  ${code}
                </div>
              </div>

              <p style="color: #555; line-height: 1.6; font-size: 16px">
                验证码
                <strong style="color: #e74c3c">5分钟</strong> 内有效，请及时使用。
              </p>

              <div
                style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee"
              >
                <p style="color: #95a5a6; font-size: 14px">温馨提示：</p>
                <ul style="color: #95a5a6; font-size: 14px; padding-left: 20px">
                  <li>请勿将验证码告知他人</li>
                  <li>如非本人操作，请忽略此邮件</li>
                  <li>如有疑问，请联系客服</li>
                </ul>
              </div>
            </div>

            <div
              style="
                text-align: center;
                margin-top: 30px;
                color: #95a5a6;
                font-size: 12px;
              "
            >
              <p>© ${new Date().getFullYear()} WANGYI. 保留所有权利.</p>
            </div>
          </div>
        `
      });

      // 存储验证码（key: email, value: {code, expiresAt}）
      verificationCodes.set(email, {
        code: code,
        expiresAt: expiresAt
      });

      return info;
    }
  };
};
