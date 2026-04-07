module.exports = (
  app,
  router
) => {
  const { ViewController } =
    app.controllers;

  // 当用户输入 http://ip:port/view/page1 就能渲染出页面

  router.get(
    '/',
    ViewController.renderView.bind(
      ViewController
    )
  );
  // 当用户输入 http://ip:port/view/xxx/xxx/xxx/* 就能渲染出页面
  // router.get('/view/:page/(.*)', ViewController.renderView.bind(ViewController));
};
