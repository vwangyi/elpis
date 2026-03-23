module.exports = (app, router) => {
  const { UserController } = app.controllers;

  router.get('/api/user/list', UserController.findAll.bind(UserController));

  router.get('/api/user/info', UserController.findUserInfo.bind(UserController));
};
