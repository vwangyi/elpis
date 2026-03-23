module.exports = (app, router) => {
  const { AuthController } = app.controllers;
  // router.post(
  //     '/api/auth/login',
  //     AuthController.login.bind(AuthController)
  // )
  router.get('/api/auth/logout', AuthController.logout.bind(AuthController));

  router.get('/api/auth/send_email_code', AuthController.sendEmailCode.bind(AuthController));
  router.post('/api/auth/login/by_email_code', AuthController.loginByEmailCode.bind(AuthController));
};

// 发送验证码
// router.post('/api/captcha/send', captchaController.sendCaptcha);

// // 验证验证码
// router.post('/api/captcha/verify', captchaController.verifyCaptcha);

// // 邮箱验证码登录
// router.post('/api/auth/login', authController.loginWithCaptcha);

// // 获取当前用户信息
// router.get('/api/auth/me', authController.getCurrentUser);

// // 退出登录
// router.post('/api/auth/logout', authController.logout);
